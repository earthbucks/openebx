use crate::block::Block;
use crate::domain::Domain;
use crate::header::Header;
use crate::header_chain::HeaderChain;
use crate::merkle_txs::MerkleTxs;
use crate::tx_out_bn_map::TxOutBnMap;
use crate::tx_verifier::TxVerifier;

pub struct BlockVerifier<'a> {
    pub block: Block,
    pub tx_out_bn_map: TxOutBnMap, // from earlier blocks
    pub lch: &'a HeaderChain,      // longest chain
}

impl<'a> BlockVerifier<'a> {
    pub fn new(block: Block, tx_out_bn_map: TxOutBnMap, lch: &'a HeaderChain) -> Self {
        Self {
            block,
            tx_out_bn_map,
            lch,
        }
    }

    pub fn header_is_valid_at(&mut self, timestamp: u64) -> bool {
        let header = &self.block.header;
        let lch = &self.lch;
        lch.new_header_is_valid_at(header, timestamp)
    }

    pub fn merkle_root_is_valid(&self) -> bool {
        let txs = &self.block.txs;
        let merkle_root = self.block.header.merkle_root;
        // TODO: Eliminate clone of txs
        let merkle_txs = MerkleTxs::new(txs.clone());
        merkle_txs.root == merkle_root
    }

    pub fn has_valid_coinbase(&self) -> bool {
        // 1. coinbase tx is first tx
        let txs = &self.block.txs;
        if txs.is_empty() {
            return false;
        }
        let coinbase_tx = &txs[0];
        if !coinbase_tx.is_coinbase() {
            return false;
        }
        // 2. lockNum equals block number
        if coinbase_tx.lock_abs != self.block.header.block_num {
            return false;
        }
        // 3. version is 1
        if coinbase_tx.version != 1 {
            return false;
        }
        // 4. all outputs are pkh
        for tx_output in &coinbase_tx.outputs {
            if !tx_output.script.is_pkh_output() {
                return false;
            }
        }
        // 5. output amount is correct
        let total_output_value: u64 = coinbase_tx.outputs.iter().map(|output| output.value).sum();
        let expected_coinbase_amount = Header::coinbase_amount(self.block.header.block_num);
        if total_output_value != expected_coinbase_amount {
            return false;
        }
        // 5. coinbase script is valid (push only)
        let coinbase_input = &coinbase_tx.inputs[0];
        let coinbase_script = &coinbase_input.script;
        if !coinbase_script.is_push_only() {
            return false;
        }
        // 6. domain name, top of the stack, is valid
        let mut script_chunks = coinbase_script.chunks.clone();
        if script_chunks.is_empty() {
            return false;
        }
        let domain_chunk = script_chunks.pop().unwrap();
        let domain_buf = domain_chunk.buffer.clone().unwrap();
        let res_domain_str = String::from_utf8(domain_buf);
        if res_domain_str.is_err() {
            return false;
        }
        let domain_str = res_domain_str.unwrap();
        if !Domain::is_valid_domain(&domain_str) {
            return false;
        }
        // note that we do not verify whether domain is actually responsive and
        // delivers this block. that would require pinging the domain name,
        // which is done elsewhere.
        true
    }

    pub fn txs_are_valid(&mut self) -> bool {
        if !self.has_valid_coinbase() {
            return false;
        }
        let txs = &self.block.txs[1..];
        // iterate through all transactions except the first (coinbase tx)
        // verify with verifier
        // if invalid, return false
        // if valid, add outputs to tx_output_map and remove used outputs
        for tx in txs {
            let mut tx_verifier =
                TxVerifier::new(tx.clone(), &self.tx_out_bn_map, self.block.header.block_num);
            if !tx_verifier.verify() {
                return false;
            }
            let header = &self.block.header;
            let block_num = header.block_num;
            self.tx_out_bn_map.add_tx_outputs(tx, block_num);
            // remove used outputs to prevent double spending
            for tx_input in &tx.inputs {
                self.tx_out_bn_map
                    .remove(&tx_input.input_tx_id.clone(), tx_input.input_tx_out_num);
            }
        }
        true
    }

    pub fn is_valid_at(&mut self, timestamp: u64) -> bool {
        if timestamp < self.block.header.timestamp {
            return false;
        }
        if !self.header_is_valid_at(timestamp) {
            return false;
        }
        if !self.merkle_root_is_valid() {
            return false;
        }
        if !self.txs_are_valid() {
            return false;
        }
        true
    }

    pub fn is_valid_now(&mut self) -> bool {
        let timestamp = Header::get_new_timestamp();
        self.is_valid_at(timestamp)
    }
}
