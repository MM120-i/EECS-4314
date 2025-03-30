import { Categories } from "@/app/lib/categories";
import clsx from "clsx";

export default function TransactionCategory({category} : {category: string}){

    const color = Categories.find(cat => cat.label === category)?.color
    return(
        <span className={`rounded-full px-2 py-1 text-xstext-black`} style={{backgroundColor: color}}>
            {category}
        </span>
    )
}