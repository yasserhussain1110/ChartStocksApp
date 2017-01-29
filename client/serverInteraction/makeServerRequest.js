import request from 'superagent';

export const asyncPost = (url, data, apiSuccessCallback, apiFailureCallBack) => {
  request
    .post(url)
    .type('form')
    .send(data)
    .set('Accept', 'application/json')
    .end(function (err, res) {
      if (err) {
        if (res) {
          apiFailureCallBack(res.body);
        }
        console.log(err);
        return;
      }
      apiSuccessCallback(res.body);
    });
};


export const asyncGet = (url, successCallback, failureCallBack) => {
  request
    .get(url)
    .end(function (err, res) {
      if (err) {
        if (res) {
          failureCallBack(res.body);
        }
        console.log(err);
        return;
      }

      successCallback(res.body);
    });
};
