# Start
## first and fast
![[Pasted image 20260103141916.png]]

## File board
``` jsx
import { createRoot } from 'react-dom/client';

function HelloMessage({ name }) {
  return <div>Hello {name}</div>;
}

const root = createRoot(document.getElementById('container'));
root.render(<HelloMessage name="Taylor" />);
```
## 

# State
	- how to use state

![[Pasted image 20251218142432.png]]

- destructure initial value
![[Pasted image 20251218142636.png]]
# Funcation useEffect
![[Pasted image 20251208210909.png]]
![[Pasted image 20251208214121.png]]
![[Pasted image 20251208214249.png]]
## poss pose to next com and usestate different type
![[Pasted image 20260105202300.png]]

```jsx
const [pose,setPose] = useState(0);
const [pose,setPose]=useState({name:"bear",story:"i have a bear dream"});

<fun pos={pose} setPos={setPose} />
```
## Upgrade State
```jsx
setPose(s=>s+1);
```
notice less use
```jsx
setPose(pose+1);
```
# Input
- if i want to input something to web 
```jsx
  const handleChange = (event) => {

    setValue(event.target.value);

  };
       <input

        type="text"

        placeholder={props.defaultText}

        value={value}

        onChange={handleChange}

        className="NewPostInput-input"

      />
```
# Routing
- import start
![[Pasted image 20260207142349.png]]
	- next set index.jsx
![[Pasted image 20260207142548.png]]