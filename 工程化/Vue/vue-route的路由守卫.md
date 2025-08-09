# Vue Router 路由守卫

Vue Router 提供了多种 **路由守卫**，允许开发者在路由变化时进行拦截、验证、导航控制等操作。路由守卫可以在不同的阶段被触发，用于控制页面跳转的行为，常见的用途包括验证用户是否登录、权限控制、路由跳转时的动画等。

## **Vue Router 的路由守卫种类**

Vue Router 提供了以下几种类型的路由守卫：

## 1. **全局守卫**

全局守卫是指在 Vue Router 实例创建时定义的守卫，它会在每次路由跳转前被触发。全局守卫可以分为 **全局前置守卫**、**全局后置守卫**。

### 1.1 **全局前置守卫（beforeEach）**

全局前置守卫会在每次路由跳转前触发，适用于路由跳转前的逻辑控制。

* 用途：比如验证用户是否登录、权限控制等。

```javascript
const router = new VueRouter({
  routes: [
    { path: '/', component: Home },
    { path: '/login', component: Login }
  ]
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 如果目标路由需要登录且用户未登录，则跳转到登录页面
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next('/login');
  } else {
    next(); // 必须调用 next()，否则跳转会卡住
  }
});
```

### 1.2 **全局后置守卫（afterEach）**

全局后置守卫会在每次路由跳转后触发，适用于进行一些跳转后的操作，如记录页面访问日志、页面滚动恢复等。

* 用途：记录日志、发送统计数据、更新 UI 状态等。

```javascript
// 全局后置守卫
router.afterEach((to, from) => {
  console.log(`Navigated from ${from.path} to ${to.path}`);
});
```

## 2. **路由独享守卫**

路由独享守卫是定义在单个路由配置中的守卫，只会影响该路由的行为。

### 2.1 **beforeEnter**

`beforeEnter` 是在路由配置中定义的守卫，在路由确认之前触发。它可以用来验证用户是否有权限访问某个页面。

* 用途：特定路由的权限检查、动态控制路由跳转等。

```javascript
const routes = [
  {
    path: '/dashboard',
    component: Dashboard,
    beforeEnter: (to, from, next) => {
      if (!isAuthenticated()) {
        next('/login');
      } else {
        next(); // 必须调用 next()
      }
    }
  }
];
```

## 3. **组件内守卫**

组件内守卫是定义在组件内部的守卫，通常用于控制组件的生命周期和路由变化时的操作。

### 3.1 **beforeRouteEnter**

`beforeRouteEnter` 在路由进入前触发，注意：这个守卫在组件实例被创建之前触发，因此无法访问组件实例（`this`）。但可以通过 `next` 函数的回调来获取组件实例。

* 用途：执行异步操作、数据预取等。

```javascript
const User = {
  template: '<div>User {{ userId }}</div>',
  beforeRouteEnter(to, from, next) {
    // 异步获取数据
    fetchData(to.params.id).then(data => {
      next(vm => { // 获取组件实例
        vm.userId = data.id;
      });
    });
  }
};
```

### 3.2 **beforeRouteUpdate**

`beforeRouteUpdate` 当路由已经确认，但组件需要重新渲染时触发。这个守卫不会在初次进入时触发，而是在组件已经存在的情况下（例如，通过动态路由参数的变化）触发。

* 用途：当路由参数变化时更新组件内容。

```javascript
const User = {
  template: '<div>User {{ userId }}</div>',
  beforeRouteUpdate(to, from, next) {
    // 路由变化时执行
    this.userId = to.params.id;
    next();
  }
};
```

### 3.3 **beforeRouteLeave**

`beforeRouteLeave` 在路由离开当前组件时触发，通常用来在用户离开组件时做一些清理工作，比如提示用户保存未保存的内容。

* 用途：处理组件离开前的清理操作。

```javascript
const User = {
  template: '<div>User {{ userId }}</div>',
  beforeRouteLeave(to, from, next) {
    const answer = window.confirm('Do you really want to leave? You have unsaved changes.');
    if (answer) {
      next();
    } else {
      next(false); // 阻止导航
    }
  }
};
```

## **总结：Vue Router 的路由守卫**

1. **全局守卫**：在 `VueRouter` 实例上定义，适用于全局范围内的路由控制。

    * **`beforeEach`**：每次路由跳转前触发。
    * **`afterEach`**：每次路由跳转后触发。

2. **路由独享守卫**：在单个路由配置中定义，只会在该路由被访问时触发。

    * **`beforeEnter`**：在路由跳转前触发。

3. **组件内守卫**：定义在组件内的守卫，适用于组件级别的路由控制。

    * **`beforeRouteEnter`**：在路由进入前触发。
    * **`beforeRouteUpdate`**：在路由参数更新时触发。
    * **`beforeRouteLeave`**：在路由离开当前组件时触发。

## **常见用途**

* **权限控制**：如登录验证、权限校验等，通常使用 `beforeEach` 或 `beforeEnter`。
* **数据加载**：通过 `beforeRouteEnter` 进行数据预取。
* **组件离开提示**：通过 `beforeRouteLeave` 提示用户保存未保存的内容。
