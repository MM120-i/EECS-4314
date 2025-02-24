export default async function Page(props: {params: Promise<{id: string}>}){
    const params = await props.params;
    const id = params.id;
    return(
        <div>
            this is {id};
            {/* TODO fetch transaction by id */}
        </div>
    )
}