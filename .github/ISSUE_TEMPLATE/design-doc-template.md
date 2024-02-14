---
name: Design Doc template
about: a Design Doc template for front-end
title: "[Design Doc] Write Design Doc title here."
labels: design doc
assignees: ''

---

## Context

作業するのに必要な前提知識、ドメインを記載する。

Write the overall knowledge and domain required for the task.

## Goals

目指すことを、文章で書く。

Describe your goals in sentences.

## Non-goals

目指さないことを、箇条書きで書く。

Describe your non-goals in bullet points.

## Overview

### Design

最低限、Figmaなどでの開発する画面のスクリーンショットを添付する。(例: 検索画面)  
コンポーネントごとにスクリーンショットがあると尚良い。

At the very least, attach screenshots of the screens being developed in tools like Figma.  
It would be even better to have screenshots for each component.

e.g.

- organisms/HogeComponent  
  (Screenshot)

## Approach, Detailed design

ソースコードと文章を織り交ぜながら設計を記述する。  
要素ごとにどの様なものか詳細に記述する。

Describe the design by integrating source code with text.  
Provide detailed descriptions for each element.

### e.g. pages/search/index.tsx

```ts
const Search:FC  = () => {
  const {  } = router.query;

  return (
    <></>
  );
};
```

### e.g. organisms/SearchForm

propsは何が必要なのか、requiredなものoptionalなもの全て記載する。  
例えばsubmit buttonを押下した際に発火するハンドラーはどういったものを想定しているか等。  
data fetchを行うのであれば、そのようなコードになることも記載する。  
ドメインロジックも想定していれば、そのことも記載する。  
要するに、そのコンポーネントで実際に書くソースコードを言語化する。  

List all the props needed, including required and optional ones.  
For example, specify what type of handler is expected to be triggered when the submit button is pressed.  
If data fetching is expected, mention it.  
Include domain logic if applicable.  
Essentially, verbalize the source code that would actually be written for the component.

## Alternative approach

もし上記の内容以外にも実装方法があり、どちらかで迷っていたりする場合は、こちらに記載する。  
 (メリデリがあると尚良い)

If there are alternative implementation methods besides the above, or if you're unsure which approach to take, it's helpful to list them here.  
(including pros and cons if possible)

## Drawback, Risk

実装において考えられる問題がある場合は記載する。

List any potential issues or challenges that may arise during implementation.

## Related link

ー
