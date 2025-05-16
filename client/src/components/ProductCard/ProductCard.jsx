import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {


    let productImage = (product && product.image) ? `http://localhost:3000/Images/${product.image}` : "";
    console.log(productImage)

    return (
        <div className="card bg-base-100 w-96 hover:border-primary border-b-8 border-transparent transition-all duration-300 shadow-lg rounded-3xl">
            <figure className="px-10 pt-10">
                <img
                    src={productImage}
                    alt="product image"
                    className="rounded-xl" />
            </figure>
            <div className="card-body flex-col w-full">
                <div className="flex flex-row justify-between">
                    <div className="flex flex-row gap-5 items-center">
                        <h2 className="card-title font-light">{product.name}</h2>
                        {product.isNew && (
                            <div className="badge badge-soft h-5 text-xs badge-secondary">NEW</div>
                        )}
                    </div>
                    <div className="badge badge-soft badge-primary">{product.collection}</div>
                </div>
                <div className="">
                    <h3 className="card-title">{product.price + " Kč"}</h3>
                </div>
                <div className="card-actions w-full">
                    <Link className="w-full" to={`/product/${product._id}`} key={product._id}>
                        <button className="btn btn-soft rounded-2xl mb-[-10px] hover:rounded-xl hover:scale-[103%] transition-all duration-200 ease-in-out btn-primary w-full">Buy Now</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}