# Components

- return single top level element (like a div)
- top level element should have className matching component (Block Name)
- Block Name should be PascalCase
- Parts of the component should have classNames matching the part (Element Name)
- Element Name should be PascalCase
- modifier class names (e.g. active, disabled, hidden) should be camelCase

```html
<div className="Card loading">
  <div className="Slide">...</div>
  <div className="Caption">...</div>
</div>
```

```scss
.Card
{
    ...
}
.Slide
{
    ...
}
.Caption
{
    ...
}
```
