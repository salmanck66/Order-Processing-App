import { LuIndianRupee } from "react-icons/lu";
import { CiHeart } from "react-icons/ci";

const ProductCard = () => {
  return (
    <div className="  w-full flex rounded-xl p-3">
      <img src="https://cdn.pixabay.com/photo/2017/06/04/23/57/stem-2372543_1280.png" className="h-16 bg-gradient-to-b  from-ternary to-ternary  via-white rounded-lg   w-fit"  alt="" />
     <div className="flex justify-between h-full items-center gap-2 px-10">
        <h1 className="text-sm font-tine  text-black">Product Name</h1>
        <h1 className="text-sm font-tine  text-black flex gap-1 h-full items-center"><LuIndianRupee/>399</h1>
        
     </div>
     {/* <CiHeart 
        className=" top-2 right-2 rounded-full bg-white p-2  text-red-500  text-4xl cursor-pointer" 
        fill={'red'}
      /> */}
</div>

  )
}

export default ProductCard