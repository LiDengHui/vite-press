# **Vue Router 是干什么的**

**Vue Router** 是 Vue.js 官方的路由管理库，用于在 Vue.js 单页面应用（SPA，Single Page Application）中进行路由管理和视图切换。它允许你定义不同的
URL 路径与对应的 Vue 组件之间的映射关系，从而实现在不同的 URL 路径下显示不同的内容。

简单来说，Vue Router 负责管理用户在应用中的导航，控制视图的切换，确保在浏览器的地址栏中显示相应的
URL，同时保持单页面应用的性能优势（即不会重新加载整个页面）。

## **Vue Router 的原理**

Vue Router 的核心原理是通过 **URL 路径与组件的映射关系** 来决定哪个组件应该在页面中渲染。当用户与页面交互时，Vue Router
会根据 URL 路径的变化动态地加载对应的组件，并将其渲染到 `router-view` 中。它利用 **hash 模式** 或 **history 模式** 来控制
URL 和组件之间的关系。

### **核心原理概述**：

1. **路由表**：Vue Router 会根据你定义的路由表（即路径与组件的映射关系）来控制 URL 和组件的绑定。
2. **路由匹配**：根据浏览器的当前路径，Vue Router 会在路由表中查找匹配的路由规则，并加载对应的组件。
3. **视图更新**：当匹配到一个新的路由时，Vue Router 会自动更新视图中的 `router-view`，并渲染与该路由匹配的组件。

## **1. 路由模式**

Vue Router 提供了两种路由模式来控制 URL 的行为：

### 1.1 **Hash 模式**（默认）

* URL 中会包含一个 `#` 符号，后面跟着实际的路由路径。例如：`http://example.com/#/home`。
* 使用浏览器的 **hashchange** 事件来监听 URL 的变化，路由的变化不会触发页面的重新加载。
* **优点**：不需要服务器配置，支持较老的浏览器。
* **缺点**： URL 包含 `#` 符号，不够美观。

```javascript
const router = new VueRouter({
    mode: 'hash',
    routes: [
        {path: '/', component: Home},
        {path: '/about', component: About}
    ]
});
```

### 1.2 **History 模式**

* URL 不再包含 `#`，而是像传统的多页面应用那样显示实际的路径。例如：`http://example.com/home`。
* 使用浏览器的 **history API** 来控制浏览器的地址栏，允许完全自定义 URL 的表现。
* **优点**：URL 更简洁、干净。
* **缺点**：需要服务器支持，配置服务器以确保所有路径返回应用的入口 HTML 文件。

```javascript
const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: '/', component: Home},
        {path: '/about', component: About}
    ]
});
```

## **2. 路由的核心概念**

### 2.1 **路由配置**

通过 `VueRouter` 来定义路由配置。每个路由配置包含：

* **`path`**：定义路由的 URL 路径。
* **`component`**：与该路径匹配时渲染的组件。
* **`name`**：路由的名称，便于在代码中引用。
* **`redirect`**：当匹配到某个路径时，自动重定向到另一个路径。
* **`children`**：定义嵌套路由，适用于父子组件之间的关系。

```javascript
const routes = [
    {path: '/', component: Home},
    {path: '/about', component: About},
    {path: '/login', component: Login},
    {
        path: '/profile', component: Profile, children: [
            {path: 'details', component: ProfileDetails}
        ]
    }
];
```

### 2.2 **动态路由参数**

Vue Router 支持动态路由参数，通过在路径中添加 `:` 来表示动态部分。

```javascript
const routes = [
    {path: '/user/:id', component: UserProfile}
];
```

访问 `http://example.com/user/123` 会将 `123` 作为 `id` 参数传递给 `UserProfile` 组件。

### 2.3 **命名路由**

命名路由允许你通过路由名称进行跳转，而不是路径。这对路由的重构和维护非常有用。

```javascript
const routes = [
    {path: '/about', component: About, name: 'about'}
];
```

通过 `this.$router.push({ name: 'about' })` 跳转到该路由。

### 2.4 **嵌套路由**

Vue Router 支持嵌套路由，可以在父路由中嵌套子路由，从而呈现多层级的视图。

```javascript
const routes = [
    {
        path: '/user', component: User, children: [
            {path: 'profile', component: UserProfile},
            {path: 'settings', component: UserSettings}
        ]
    }
];
```

### 2.5 **路由守卫**

路由守卫用于控制路由的导航流程，常用于登录验证、权限管理等场景。Vue Router 提供了多种路由守卫：

* **全局守卫**：在路由跳转时全局触发。
* **单个路由守卫**：在特定的路由组件中触发。
* **路由独享守卫**：只对某个路由有效。

```javascript
// 全局前置守卫
router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !isAuthenticated()) {
        next('/login');
    } else {
        next();
    }
});
```

## **3. 路由之间的跳转**

Vue Router 提供了多种方式来进行路由跳转。常见的跳转方式有：

### 3.1 **编程式导航**

通过 `$router` 对象进行跳转：

* **`this.$router.push()`**：跳转到指定的路由，可以是路径或命名路由。

  ```javascript
  this.$router.push('/about');
  this.$router.push({ name: 'about' });
  ```

* **`this.$router.replace()`**：跳转到指定的路由，并替换当前记录在 history 栈中的路由（不会产生历史记录）。

  ```javascript
  this.$router.replace('/home');
  ```

* **`this.$router.go()`**：通过指定相对历史记录的方式进行跳转。

  ```javascript
  this.$router.go(-1); // 后退一步
  this.$router.go(1);  // 前进一步
  ```

### 3.2 **声明式导航**

通过 `router-link` 组件进行跳转。`router-link` 是 Vue Router 提供的专门用于路由跳转的组件，类似于 `<a>` 标签。

```vue

<router-link to="/about">Go to About</router-link>
<router-link :to="{ name: 'about' }">Go to About</router-link>
```

### 3.3 **带查询参数的跳转**

在路由跳转时可以携带查询参数。例如：`/user?id=123`。

```javascript
this.$router.push({path: '/user', query: {id: 123}});
```

在组件中，您可以通过 `$route.query.id` 获取查询参数。

### 3.4 **命名路由与参数**

使用命名路由和动态参数来进行跳转：

```javascript
this.$router.push({name: 'user', params: {id: 123}});
```

## **4. 总结**

* **Vue Router** 是 Vue.js 的官方路由管理库，提供了路由的定义、导航和管理功能。
* 它基于 **hash 模式** 或 **history 模式** 来控制浏览器的 URL 和页面内容的映射。
* 路由之间的跳转可以通过编程式导航（`$router.push()`、`$router.replace()`）或者声明式导航（`<router-link>`）来实现。
* 路由守卫允许开发者控制路由的访问权限和流转。
