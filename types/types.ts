export interface Course {
  _id: string;
  title: string;
  description: string;
  slug: string;
  price: number;
  level: string;
  thumbnail_url: string;
  created_at: string;
  updated_at: string;
  rating?: number;
}



interface Author {
  fullname: string;
}

export interface Ebook {
  _id: string;
  title: string;
  slug: string;
  description: string;
  author: Author;
  selar_product_id: string;
  thumbnail_url: string;
  price: number;
  created_at: string;
}


export interface BlogPost {
    title: string;
    slug: string;
    content: string;
    thumbnail_url: string | null;
    category: string;
    author: {
        username?: string;
        fullname?: string;
        email?: string;
    };
    created_at: string;
}
