export const productFilter = (data: any, search: string) => {
    return data.filter((product: any) => product.name.toLowerCase().includes(search.toLowerCase()));
}