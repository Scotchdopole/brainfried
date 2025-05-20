import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {


    return (
        <div className="card bg-base-100 w-96 min-h-[25rem] hover:border-primary border-b-8 border-transparent transition-all duration-300 shadow-lg rounded-3xl">
            <figure className="px-10 pt-10">
                <img
                    src={product.imageUrl}
                    alt="product image"
                    className="rounded-xl h-[20rem] object-contain" />
            </figure>
            <div className="card-body flex justify-end flex-col w-full">
                <div className="flex flex-row justify-between ">
                            <h2 className="card-title font-light">{product.name}</h2>
                    <div className="flex flex-row">
                        <div className="flex flex-row items-center">
                            {product.isNew && (
                                <div className="badge badge-soft h-5 text-xs badge-secondary">NEW</div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-row justify-between">
                    <h3 className="card-title">{product.price + " Kč"}</h3>
                    <div className="badge badge-soft badge-primary">{product.collection}</div>
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