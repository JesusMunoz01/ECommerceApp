export const productFilter = (data: any, search: string) => {
    return data.filter((product: any) => product.name.toLowerCase().includes(search.toLowerCase()));
}

export const orderFilter = (data: any, search: string) => {
    return data.filter((order: any) => order.id.toString().includes(search.toLowerCase()));
}