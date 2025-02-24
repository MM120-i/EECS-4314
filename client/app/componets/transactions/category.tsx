import clsx from "clsx";

export default function TransactionCategory({category} : {category: string}){
    return(
        <span className={clsx(`rounded-full px-2 py-1 text-xs text-white`,
            {
                "bg-red" : category === 'red',
                "bg-orange": category === "orange",
                "bg-yellow text-black": category === "yellow",
                "bg-green": category === "green",
                "bg-blue": category === "blue",
                "bg-indigo": category === "indigo",
                "bg-violet": category === "violet",
            },
        )}>
            {category}
        </span>
    )
}