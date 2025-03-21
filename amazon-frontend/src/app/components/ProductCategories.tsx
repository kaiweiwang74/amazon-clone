const categories = [
    { name: "Electronics", translation: "Electronics" },
    { name: "Clothing", translation: "Clothing" },
    { name: "Home Goods", translation: "Home Goods" },
    { name: "Books", translation: "Books" },
    { name: "Sports", translation: "Sports" }
  ];
  
  const ProductCategories = () => {
    return (
      <div className="mt-8 mx-auto max-w-5xl">
        <h2 className="text-2xl font-bold">Product Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {categories.map((category, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-32 h-32 flex items-center justify-center bg-gray-200 rounded-full shadow-md">
                <span className="text-lg font-bold">{category.name}</span>
              </div>
              <span className="text-gray-600 mt-2">{category.translation}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default ProductCategories;
  