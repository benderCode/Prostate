let formData = new FormData();
formData.append("idCard", "1");
fetch('url', {
    method: 'POST',
    headers: {
        
        "token": global.Token,
    },
    body: formData,
}).then((response) => response.json())
    .then((responseData) => {
        console.log('responseData', responseData);
        if (responseData.code == 20000) {

        } else if (responseData.code == 40001) {

        } else if (responseData.code == 50000) {

        } else if (responseData.code == 50003) {

        } else {

        }
    })
    .catch((error) => {
        console.log('error', error);
    });