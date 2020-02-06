import '@k2oss/k2-broker-core';

metadata = {
    systemName: "com.k2.countries",
    displayName: "Countries Broker",
    description: "An example broker that accesses Countries."
};

ondescribe = async function (): Promise<void> {
    postSchema({
        objects: {
            "com.k2.country": {
                displayName: "Get List of countries",
                description: "Get List of countries from rest api",
                properties: {
                    "com.k2.country.name": {
                        displayName: "Name",
                        type: "string"
                    },
                    "com.k2.country.alpha2Code": {
                        displayName: "Alpha2 Code",
                        type: "string"
                    },
                    "com.k2.country.capital": {
                        displayName: "Capital",
                        type: "string"
                    },
                    "com.k2.country.nativeName": {
                        displayName: "Native Name",
                        type: "string"
                    },
                    "com.k2.country.flag": {
                        displayName: "Flag",
                        type: "string"
                    }
                },
                methods: {
                    "com.k2.country.list": {
                        displayName: "Get Countries",
                        type: "read",
                        inputs: ["com.k2.country.id"],
                        outputs: ["com.k2.country.id", "com.k2.country.userId", "com.k2.country.title", "com.k2.country.completed"]
                    }
                }
            }
        }
    });
}

onexecute = async function (objectName, methodName, _parameters, properties): Promise<void> {
    switch (objectName) {
        case "com.k2.country": await onexecuteTodo(methodName, properties); break;
        default: throw new Error("The object " + objectName + " is not supported.");
    }
}

async function onexecuteTodo(methodName: string, properties: SingleRecord): Promise<void> {
    switch (methodName) {
        case "com.k2.country.list": await onexecutecountrieslist(properties); break;
        default: throw new Error("The method " + methodName + " is not supported.");
    }
}

function onexecutecountrieslist(properties: SingleRecord): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            try {
                if (xhr.readyState !== 4) return;
                if (xhr.status !== 200) throw new Error("Failed with status " + xhr.status);

                var obj = JSON.parse(xhr.responseText);
                postResult({
                    "com.k2.country.name": obj.name,
                    "com.k2.country.alpha2Code": obj.alpha2Code,
                    "com.k2.country.capital": obj.capital,
                    "com.k2.country.flag": obj.flag
                });
                resolve();
            } catch (e) {
                reject(e);
            }
        };

        xhr.open("GET", 'https://restcountries.eu/rest/v2/all');
        //xhr.setRequestHeader('test', 'test value');
        xhr.send();
    });
}
