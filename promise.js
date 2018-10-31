/*
* new Promise( function(resolve, reject) { ... } );
* 里面的function定义了promise的behavior。resolve reject也是两个function。浏览器会立即执行
* resolve reject并不用管，我们只管call它们。call resolve浏览器就马上resolve这个promise
* behavior function会立刻执行。我们需要在其中描述何时何种条件resolve 和reject被call
*/



function createPromise(success, wait) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            if (success) {
                resolve(4444);
            }else {
                reject(6666);
            }
        }, wait);// 这个就是两秒之后再call resolve
        if (success) {
            resolve(123);
        }else {
            reject(456);
        }

    });
}
const p = createPromise(true, 5000); // 5s后resolve
p.then((v) => {
    console.log('success');
    console.log(v); // log 123, 也就是resolve传入的值
    // 结束之后自动retur你一个resolved的promise。但是这样是没有任何值的resolved的promise
    return createPromise(false, 3000); // 要先执行promise中的new promise，然后最终被执行的是reject。5秒666，
    // 也就是上面const p中发出的，3秒444
}, () => {
    console.log('reject');
    console.log(v); // log 456, 也就是reject传入的值

}).then((v) => {
    console.log('success');
    console.log(v); // log 123, 也就是resolve传入的值
}, () => {
    console.log('reject');
    console.log(v); // log 456, 也就是reject传入的值
    throw new Error("catch me"); // 这个就会被catch抓住。throw后面的内容就不会被执行了
}).catch((err) => {
    // 一旦chain中出现error就会被这个catch
    // 或者是你没有写reject callback，reject情况也会被这个catch捉住
    // catch也可以return一个promise给后面的promise接住
}).then();

fetch("https://jsonplaceholder.typicode.com/posts", {
    method: 'POST',
    body: JSON.stringify({ title: 'my post', content: 'post content'})
}).then((response) => {
    if (response.ok) {
        return response;
    }
    throw new Error(response.statusText);
})
    .then((response) => response.json()) // response.text()这里搞成两个then就是防止文件太大.json()搞太久
    .then((response) => console.log(response))
    .catch((err) => console.log(err))