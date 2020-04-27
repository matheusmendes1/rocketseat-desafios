import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Product): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const productsStoraged = await AsyncStorage.getItem(
        '@GoMarketPlace: cart',
      );

      if (productsStoraged) {
        setProducts(JSON.parse(productsStoraged));
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      const productOnCart = products.find(item => item.id === product.id);
      if (productOnCart) {
        const productUpdated: Product = {
          id: productOnCart.id,
          title: productOnCart.title,
          image_url: productOnCart.image_url,
          price: productOnCart.price,
          quantity: productOnCart.quantity + 1,
        };
        const updatedList: Product[] = products.filter(
          item => item.id !== productUpdated.id,
        );

        setProducts([...updatedList, productUpdated]);

        await AsyncStorage.setItem(
          '@GoMarketPlace: cart',
          JSON.stringify([...updatedList, productUpdated]),
        );
      }

      if (!productOnCart) {
        const newProductOnCart: Product = {
          id: product.id,
          title: product.title,
          image_url: product.image_url,
          price: Number(product.price),
          quantity: 1,
        };

        setProducts([...products, newProductOnCart]);
      }

      await AsyncStorage.setItem(
        '@GoMarketPlace: cart',
        JSON.stringify(products),
      );
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      const newProductsList: Product[] = products.map(item => {
        if (item.id === id) {
          const updatedQuantity: Product = {
            id: item.id,
            title: item.title,
            image_url: item.image_url,
            price: item.price,
            quantity: item.quantity + 1,
          };
          return updatedQuantity;
        }
        return item;
      });
      setProducts(newProductsList);

      await AsyncStorage.setItem(
        '@GoMarketPlace: cart',
        JSON.stringify(newProductsList),
      );
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const checkItem: Product | undefined = products.find(
        item => item.id === id,
      );

      if (checkItem !== undefined) {
        if (checkItem.quantity === 1) {
          const newProductsList = products.filter(item => item.id !== id);

          setProducts(newProductsList);
        } else {
          const newProductsList: Product[] = products.map(item => {
            if (item.id === id) {
              const updatedQuantity: Product = {
                id: item.id,
                title: item.title,
                image_url: item.image_url,
                price: item.price,
                quantity: item.quantity - 1,
              };
              return updatedQuantity;
            }
            return item;
          });

          setProducts(newProductsList);
        }
      }
      await AsyncStorage.setItem(
        '@GoMarketPlace: cart',
        JSON.stringify(products),
      );
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
