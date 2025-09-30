/** Mock API response data */
const SELECT_RESPONSE_DATA = {
  success: true,
  code: 0,
  data: [
    {
      label: 'Apple',
      value: 1
    },
    {
      label: 'Banana',
      value: 2
    },
    {
      label: 'Orange',
      value: 3,
      disabled: true
    }
  ],
  message: 'Successfully retrieved select data'
};

const ERROR_MESSAGE = 'API error occurred';

/** Mock API */
export function getSelectDataApi() {
  return new Promise<typeof SELECT_RESPONSE_DATA>((resolve, reject) => {
    // Simulate API response time of 2s
    setTimeout(() => {
      if (Math.random() < 0.8) {
        // Simulate successful API call
        resolve(SELECT_RESPONSE_DATA);
      } else {
        // Simulate API error
        reject(new Error(ERROR_MESSAGE));
        ElMessage.error(ERROR_MESSAGE);
      }
    }, 2000);
  });
}
