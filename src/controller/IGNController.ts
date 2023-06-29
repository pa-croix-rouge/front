export const getCitiesFromPostalCode = async (postalCode: string): Promise<any> => {
    const response = await fetch(`https://apicarto.ign.fr/api/codes-postaux/communes/${postalCode}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow',
    });

    if (!response.ok) {
        throw new Error(`Reading from barcode failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.map((city: any) => city.nomCommune);
}
