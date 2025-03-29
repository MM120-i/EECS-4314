import clsx from "clsx";

export default function TransactionCategory({category} : {category: string}){
    return(
        <span className={clsx(`rounded-full px-2 py-1 text-xs`,
            {
                "bg-customred text-white" : category === 'Grocery',
                "bg-orange text-white": category === "Dining",
                "bg-customyellow text-black": category === "yellow",
                "bg-customgreen text-white": category === "green",
                "bg-blue text-white": category === "blue",
                "bg-indigo text-white": category === "indigo",
                "bg-violet text-white": category === "violet",
            },
        )}>
            {category}
        </span>
    )
}