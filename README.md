## How to use
```javascript
const fetchData = () => fetch("https://filesamples.com/samples/code/json/sample2.json").then((resp) => resp.json());

function ShowData() {
  const [triggerFetch, loading, data, error] = useAPI(fetchData);

  async function handleClick(provider: string) {
    const { data } = await triggerFetch();
  }
  
  ...
}
```
