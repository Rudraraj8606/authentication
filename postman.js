// this is the pre-req script in postman

const token = pm.environment.get('accessToken');
const tokenExpiry = pm.environment.get('raj1expin');
const currentTime = pm.environment.get("raj1CD");

if (!token || tokenExpiry < currentTime) {
    // Access token is expired, refresh it using the refresh token
    const refreshToken = pm.environment.get('refreshToken');

    pm.sendRequest({
        url: 'http://localhost:9000/api/movies',
        method: 'POST',
        header: { 
            "Content-Type": "application/json" ,
            "accesstoken": pm.environment.get("raj1at"),
            "refreshtoken": pm.environment.get("raj1rt")
            },
        body: {
            mode: 'raw',
            raw: {}
        }
    }, function (err, res) {
        if (err) {
            console.error('Error refreshing token:', err);
            return;
        }

        const newAccessToken = res.json().AT;
         // Decode JWT to get the expiry time
        const newExpiryTime = res.json().exp
        const crrtime = res.json().currentT

        // Update environment variables with the new access token and expiry time
        pm.environment.set('raj1at', newAccessToken);
        pm.environment.set('raj1expin', newExpiryTime);
        pm.environment.set('raj1CD', crrtime)

        // Retry the original request with the new access token
        pm.request.headers.add({ 
            "accesstoken": newAccessToken
         });
    });
} else {
    // If the token is valid, continue with the request
    pm.sendRequest({
        url: 'http://localhost:9000/api/movies',
        method: 'POST',
        header: { 
            "Content-Type": "application/json" ,
            "accesstoken": pm.environment.get("raj1at"),
            },
        body: {
            mode: 'raw',
            raw: {
                
            }
        }
    }, function (err, res) {
        if (err) {
            console.error('Error fetching data:', err);
            return;
        }
        console.log(res)
    })
    // pm.request.headers.add({ key: 'Authorization', value: `Bearer ${token}` });
}