# Tuval Cache


[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/tuvalframework/cache/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@tuval/database/latest.svg)](https://www.npmjs.com/package/@tuval/cache)
[![npm downloads](https://img.shields.io/npm/dm/@tuval/cache.svg)](https://www.npmjs.com/package/@tuval/cache)
[![Follow on Twitter](https://img.shields.io/twitter/follow/tuvalframework.svg?label=follow+tuvalframework)](https://twitter.com/tuvalframework)
[![Follow on Youtube](https://img.shields.io/youtube/channel/views/UCIvOMAYBuLllvPIJp0o-opQ?style=social)](https://www.youtube.com/channel/UCIvOMAYBuLllvPIJp0o-opQ)


Tuval framework önbellek kütüphanesi, uygulama önbelleğini depolamak, yüklemek ve temizlemek için basit ve hafif bir kütüphanedir. Bu kütüphane, öğrenmesi ve kullanması kolay olacak şekilde tasarlanmıştır. Bu kütüphane [Appconda ekibi](https://appconda.io) tarafından yazilmakta ve desteklenmektedir.

Bu kütüphane [Tuval Framework](https://github.com/tuvalframework) projesinin bir parçası olmasına rağmen, bağımlılık içermemektedir ve herhangi bir Nodejs projesi veya framework ile bağımsız olarak kullanılabilir.

## Getting Started

Install using npm:
```bash
npm install @tuval/cache
```
Install using yarn:
```bash
yarn add @tuval/cache
```

**File System Adapter**

```typescript
import { Cache, Filesystem } from "@tuval/cache";

const cache = new Cache(new Filesystem("./cache"));

const data = cache.load("data-from-example.com", 60 * 60 * 24 * 30 * 3 /* 3 months */);

if(!data) {
    const data = await fetch("https://example.com");
    cache.save("data-from-example.com", data);
}

console.log(data);
```

