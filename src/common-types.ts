export type Credentials = {
  email: string;
  password: string;
};

export interface RefreshTokenResult {
  data?: {
    access?: string;
    refresh?: string;
  };
}

export type Instrument = {
  id: number;
  stock_token: string;
  token: string;
  instrument: string | null; // nullable due to potential null value in data
  short_name: string;
  series: string;
  company_name: string;
  expiry: string | null; // nullable due to potential null value in data
  strike_price: number;
  option_type: string | null; // nullable due to potential null value in data
  exchange_code: string;
  exchange: number;
};

export type Candle = {
  open: number;
  high: number;
  low: number;
  close: number;
  date: string;
};

export interface BreezeAccount {
  id: number;
  name: string;
  api_key: string;
  api_secret: string;
  session_token: string;
  last_updated: string;
  is_active: boolean;
}
