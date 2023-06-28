const {API_URL} = require('env');

const readToken = (): string => {
    // const {token, setToken} = useContext(TokenContext);
    // const localToken =  localStorage.getItem('token');
    //
    // if (token === undefined || token === null || token === '') {
    //     setToken(localToken);
    // }
    //
    // if (localToken === undefined || localToken === null || localToken === '') {
    //     setToken('');
    // }

    return localStorage.getItem('token');
}

export const getWithToken = async (url: string): Promise<Response> => {
    return fetch(`${API_URL}/${url}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + readToken(),
        },
        redirect: 'follow',
    }).then((response) => {
        if (response.status === 401) {
            localStorage.setItem('token', '');
        }
        return response;
    });
}

export const postWithoutToken = async (url: string, body: any): Promise<Response> => {
    return fetch(`${API_URL}/${url}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })
}

export const postWithToken = async (url: string, body: any): Promise<Response> => {
    return fetch(`${API_URL}/${url}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + readToken(),
        },
        body: JSON.stringify(body),
    }).then((response) => {
        if (response.status === 401) {
            localStorage.setItem('token', '');
        }
        return response;
    });
}

export const putWithToken = async (url: string, body: any): Promise<Response> => {
    return fetch(`${API_URL}/${url}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + readToken(),
        },
        body: JSON.stringify(body),
    }).then((response) => {
        if (response.status === 401) {
            localStorage.setItem('token', '');
        }
        return response;
    });
}

export const deleteWithToken = async (url: string): Promise<Response> => {
    return fetch(`${API_URL}/${url}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + readToken(),
        },
    }).then((response) => {
        if (response.status === 401) {
            localStorage.setItem('token', '');
        }
        return response;
    });
}
