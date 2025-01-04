+++
title = "Markdown Test"
date = "2022-01-01"
updated = "2024-06-14"

[taxonomies]
tags=["educational", "tutorial"]

[extra]
repo_view = true
read_time = true
+++

# H1
## H2
### H3


Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Aliquet sagittis id consectetur purus ut. In pellentesque massa placerat duis ultricies. Neque laoreet suspendisse interdum consectetur libero id. Justo nec ultrices dui sapien eget mi proin. Nunc consequat interdum varius sit amet mattis vulputate. Sollicitudin tempor id eu nisl nunc mi ipsum. Non odio euismod lacinia at quis. Sit amet nisl suscipit adipiscing. Amet mattis vulputate enim nulla aliquet porttitor lacus luctus accumsan. Sit amet consectetur adipiscing elit pellentesque habitant. Ac placerat vestibulum lectus mauris. Molestie ac feugiat sed lectus vestibulum mattis ullamcorper velit sed. [Google](https://www.google.com)

![Markdown Logo](https://markdown-here.com/img/icon256.png)

## Code Block

```rust
fn main() {
    println!("Hello WorldHello WorldHello WorldHello WorldHello WorldHello WorldHello WorldHello WorldHello WorldHello WorldHello World")
}
```

```random
Random text
```


```rust,hl_lines=2,linenos
fn main() {
    println!("Hello World");
}
```

## Ordered List

1. First item
2. Second item
3. Third item

## Unordered List

- List item
- Another item
- And another item

## Nested list

- Fruit
  - Apple
  - Orange
  - Banana
- Dairy
  - Milk
  - Cheese

## Quote

> Two things are infinite: the universe and human stupidity; and I'm not sure about the
> universe.<br>
> — <cite>Albert Einstein</cite>


## Table Inline Markdown

| Italics   | Bold     | Code   | StrikeThrough     |
| --------  | -------- | ------ | ----------------- |
| *italics* | **bold** | `code` | ~~strikethrough~~ |

## Foldable Text

<details>
    <summary>Title 1</summary>
    <p>IT'S A SECRET TO EVERYBODY.</p>
</details>

<details>
    <summary>Title 2</summary>
    <p>Stay awhile, and listen!</p>
</details>

## Code tags

Lorem ipsum `dolor` sit amet, `consectetur adipiscing` elit. 
`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`

## Note
 
Here is an example of the `note` shortcode:

This one is static!
{{ note(header="Note!", body="This blog assumes basic terminal maturity") }}

This one is clickable!
{{ note(clickable=true, hidden = true, header="Quiz!", body="The answer to the quiz!") }}


Syntax:
```
{{/* note(header="Note!", body="This blog assumes basic terminal maturity") */}}
{{/* note(clickable=true, hidden = true, header="Quiz!", body="The answer to the quiz!") */}}
```

You can also use some HTML in the text:
{{ note(header="Note!", body="<h1>This blog assumes basic terminal maturity</h1>") }}


Literal shortcode:
```
{{/* note(header="Note!", body="<h1>This blog assumes basic terminal maturity</h1>") */}}
```

Pretty cool, right?

Finally, you can do something like this (hopefully):

{% note(clickable=true, header="Quiz!") %}

# Hello this is markdown inside a note shortcode

```rust
fn main() {
    println!("Hello World");
}
```

We can't call another shortcode inside a shortcode, but this is good enough.

{% end %}

Here is the raw markdown:

````markdown
{{/* note(clickable=true, header="Quiz!") */}}

# Hello this is markdown inside a note shortcode

```rust
fn main() {
    println!("Hello World");
}
```

We can't call another shortcode inside a shortcode, but this is good enough.

{{/* end */}}
````

Finally, we have center
{{ note(center=true, header="Centered Text", body="This is centered text") }}

```markdown
{{/* note(center=true, header="Centered Text", body="This is centered text") */}}
```


It works good enough for me!

Testing[^1]

Other stuff I stole lol:

{% mermaid() %}
graph LR
    A[Start] --> B[Initialize]
    B --> C[Processing]
    C --> D[Complete]
    D --> E[Success]
    
    style A fill:#f9f,stroke:#333
    style E fill:#9f9,stroke:#333
{% end %}

```rust
{{ remote_text(src="https://raw.githubusercontent.com/SeniorMars/seniormars.com/refs/heads/main/content/posts/everyday_birthday/src/flajolet.rs") }}
```

{{ spoiler(text="text to hide", fixed_blur=false) }}


````markdown
{%- mermaid() -%}
graph LR
    A[Start] --> B[Initialize]
    B --> C[Processing]
    C --> D[Complete]
    D --> E[Success]
    
    style A fill:#f9f,stroke:#333
    style E fill:#9f9,stroke:#333
{%- end -%}

```rust
{{/* remote_text(src="https://raw.githubusercontent.com/SeniorMars/seniormars.com/refs/heads/main/content/posts/everyday_birthday/src/flajolet.rs") *\}}
```

{{/* spoiler(text="text to hide", fixed_blur=false) \*}}
````

[^1]: hello
