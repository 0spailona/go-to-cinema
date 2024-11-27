//const basedUrl = import.meta.env.VITE_URL

const basedUrl = "import.meta.env.VITE_URL"

export async function sendDataToServer(content) {
    const fullUrl = `${basedUrl}/api/${content.userType}/${content.dataType}`;
    const body = JSON.stringify(content.data)

    return await fetch(fullUrl, {
        headers: {'Content-Type': 'application/json'},
        method: "POST",
        body: body
    });
}