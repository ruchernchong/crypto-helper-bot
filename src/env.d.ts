declare global {
  namespace NodeJS {
    interface ProcessEnv {
      COINMARKETCAP_API_KEY: string;
      COINMARKETCAL_API_KEY: string;
      TELEGRAM_BOT_TOKEN: string;
    }
  }
}

export {};
