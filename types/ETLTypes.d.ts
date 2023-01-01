declare interface iFeature {
    product_id: string;
    feature: string;
    value: string;
  }

declare interface iPhoto {
  id: string;
  styleId: string;
  url: string;
  thumbnail_url: string;
}

declare interface iStyle {
  id: number;
  productId: string;
  name: string;
  sale_price: string | null;
  original_price: string;
  default_style: boolean;
}

declare interface iSku {
  id: string;
  styleId: string;
  size: string;
  quantity: string;
}

declare interface batchItems {
  updateOne: {
    filter: object;
    update: object;
    hint: string;
  }
}

declare interface iProducts {
  id: number,
  name: string,
  slogan: string,
  description: string,
  category: string,
  default_price: string,
  features: []
}