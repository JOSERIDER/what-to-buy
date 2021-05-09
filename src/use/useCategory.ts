export default function useCategory() {
  const PRODUCT_CATEGORIES: any[] = [
    { text: "Any category", value: "-1" },
    { text: "Cleaning products", value: "0" },
    { text: "Animal articles", value: "1" },
    { text: "Baby items", value: "2" },
    { text: "Drinks", value: "3" },
    { text: "Alcoholic drinks", value: "4" },
    { text: "Meat/eggs", value: "5" },
    { text: "Sweets/breakfast", value: "6" },
    { text: "Specialities/Salts/Condiments", value: "7" },
    { text: "Pharmacy", value: "8" },
    { text: "Fruit/Vegetables", value: "9" },
    { text: "nuts", value: "10" },
    { text: "Home products", value: "11" },
    { text: "Dairy", value: "12" },
    { text: "Bakery", value: "13" },
    { text: "Pasta/Rice", value: "14" },
    { text: "Fish", value: "15" },
    { text: "Health/Beauty", value: "16" },
  ];

  return { categories: PRODUCT_CATEGORIES };
}
