use ebx_lib::tx::Tx;
use sqlx::types::chrono;

#[derive(Debug, sqlx::FromRow)]
pub struct MineTxOutput {
    pub tx_id: String,
    pub tx_out_num: u32,
    pub value: u64,
    pub script: String,
    pub created_at: chrono::NaiveDateTime,
    pub spent_by_tx_id: Option<String>,
    pub spent_by_tx_in_num: Option<u32>,
}

impl MineTxOutput {
    pub fn from_tx(tx: &Tx) -> Vec<Self> {
        tx.outputs
            .iter()
            .enumerate()
            .map(|(tx_out_num, tx_out)| Self {
                tx_id: hex::encode(tx.id()),
                tx_out_num: tx_out_num as u32,
                value: tx_out.value,
                script: hex::encode(tx_out.script.to_u8_vec()),
                spent_by_tx_id: None,
                spent_by_tx_in_num: None,
                created_at: chrono::Utc::now().naive_utc(),
            })
            .collect()
    }

    pub async fn get_all_from_tx_ids_and_tx_out_nums(
        tx_id_tx_out_num_tuples: &[(String, u32)],
        pool: &sqlx::MySqlPool,
    ) -> Result<Vec<Self>, sqlx::Error> {
        // simpler approach: IN clause
        let placeholders: Vec<String> = tx_id_tx_out_num_tuples
            .iter()
            .map(|_| "(?, ?)".to_string())
            .collect();
        let sql = format!(
            "SELECT * FROM `mine_tx_output` WHERE (tx_id, tx_out_num) IN ({})",
            placeholders.join(", ")
        );

        let mut query = sqlx::query_as::<_, Self>(&sql);

        for (tx_id, tx_out_num) in tx_id_tx_out_num_tuples {
            query = query.bind(tx_id).bind(tx_out_num);
        }

        let rows: Vec<MineTxOutput> = query.fetch_all(pool).await?;

        Ok(rows)

        // more complex approach: temporary table
        // // Start a transaction
        // let mut tx = pool.begin().await?;

        // // Create a temporary table
        // sqlx::query("CREATE TEMPORARY TABLE temp (txid INT, txoutnum INT)")
        //     .execute(&mut tx)
        //     .await?;

        // // Insert the (txid, txoutnum) pairs into the temporary table
        // for (txid, txoutnum) in &pairs {
        //     sqlx::query("INSERT INTO temp (txid, txoutnum) VALUES (?, ?)")
        //         .bind(txid)
        //         .bind(txoutnum)
        //         .execute(&mut tx)
        //         .await?;
        // }

        // // Join the temporary table with the main table
        // let rows: Vec<MyRowType> = sqlx::query_as("SELECT * FROM main JOIN temp ON main.txid = temp.txid AND main.txoutnum = temp.txoutnum")
        //     .fetch_all(&mut tx)
        //     .await?;

        // // Commit the transaction
        // tx.commit().await?;
    }
}
