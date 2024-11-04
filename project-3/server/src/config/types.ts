export interface DatabaseConfig {
    user: string;
    host: string;
    database: string;
    password: string;
    port: number;
    ssl: {
      rejectUnauthorized: boolean;
    };
  }
  
  export interface OrderDetails {
    entree_side: any[];
    drink_table: any[];
    appetizers: any[];
    free_items: any[];
  }
  
  export interface DbOrder {
    order_id: number;
    order_date: Date;
    total_price: number;
    order_details: OrderDetails;
  }