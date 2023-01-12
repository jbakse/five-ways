Survey responses are created (as empty) when survey is loaded, and updated when selections are made. Submitting the form or question is not required to record result.

# scss components with nested classes

- Top level classes are scoped
- _Nested_ classes are _also_ scoped
- you can opt out of scoping nested classes with :global
- this lets you use the plain string class name on your module children, but this can cause problems if a child module uses the same class name

````scss
.component {
  :global {
    .test {
      border: 10px solid red;
    }
  }

  .test2 {
    border: 10px solid blue;
  }
}

```css .module_component__hash .test {
  border: 10px solid red;
}
.module_component__hash .module_test2__hash {
  border: 10px solid blue;
}
````

```js
return (
  <div className={styles.message}>
    <span className="test">Sense</span>
    <span className={styles.test2}>of</span>
  </div>
);
```
