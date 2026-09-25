// Small display helpers shared by the table and the cards
export const formatPrice = (n) => `$${n.toFixed(2)}`;
export const formatCategory = (c) => c.replace(/-/g, " ");
export const formatStock = (n) => (n === 0 ? "Out of stock" : `${n} in stock`);
