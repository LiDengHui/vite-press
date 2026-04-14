# vue2 过滤器

在 Vue 中，**自定义过滤器**（Custom Filters）允许你在模板中对数据进行格式化或转换。虽然 Vue 3 中已经废弃了过滤器的功能，但 Vue 2 中依然可以使用自定义过滤器，且在某些场景下非常有用。

## 1. **Vue 2 中实现自定义过滤器**

### 1.1 **全局注册过滤器**

在 Vue 2 中，你可以通过 `Vue.filter()` 来全局注册一个自定义过滤器。这个过滤器可以在应用的任何模板中使用。

```javascript
// 全局注册自定义过滤器
Vue.filter('capitalize', function (value) {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
});
```

注册之后，可以在模板中使用该过滤器：

```vue
<template>
  <div>{{ message | capitalize }}</div>
</template>

<script>
export default {
  data() {
    return {
      message: 'hello world'
    };
  }
};
</script>
```

在这个例子中，`capitalize` 过滤器将字符串的首字母转换为大写。

### 1.2 **局部注册过滤器**

如果你只需要在某个组件内使用过滤器，可以在组件中注册过滤器，使用 `filters` 选项。

```javascript
export default {
  filters: {
    capitalize(value) {
      if (!value) return '';
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  },
  data() {
    return {
      message: 'hello world'
    };
  }
};
```

然后在模板中使用：

```vue
<template>
  <div>{{ message | capitalize }}</div>
</template>
```

### 1.3 **自定义过滤器的传参**

你可以为自定义过滤器传递额外的参数。例如，我们可以传入一个数字，表示字符应该被截断到的长度：

```javascript
Vue.filter('truncate', function (value, length) {
  if (!value) return '';
  return value.length > length ? value.substring(0, length) + '...' : value;
});
```

使用过滤器时，可以传递 `length` 参数：

```vue
<template>
  <div>{{ longText | truncate(10) }}</div>
</template>

<script>
export default {
  data() {
    return {
      longText: 'This is a long text that needs truncation.'
    };
  }
};
</script>
```

## 2. **Vue 3 中自定义过滤器的变动**

在 Vue 3 中，**过滤器已被移除**，官方推荐使用计算属性（computed properties）或方法来代替过滤器的功能。因此，虽然 Vue 3 不再支持过滤器，但你可以使用以下方法进行数据转换。

### 2.1 **使用计算属性代替过滤器**

```vue
<template>
  <div>{{ capitalizedMessage }}</div>
</template>

<script>
export default {
  data() {
    return {
      message: 'hello world'
    };
  },
  computed: {
    capitalizedMessage() {
      return this.message.charAt(0).toUpperCase() + this.message.slice(1);
    }
  }
};
</script>
```

### 2.2 **使用方法代替过滤器**

你可以使用方法来处理模板中的数据。例如：

```vue
<template>
  <div>{{ capitalize(message) }}</div>
</template>

<script>
export default {
  data() {
    return {
      message: 'hello world'
    };
  },
  methods: {
    capitalize(value) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  }
};
</script>
```

## 3. **常见的自定义过滤器**

尽管 Vue 3 移除了过滤器功能，以下是一些在 Vue 2 中常见的自定义过滤器类型，若你在 Vue 2 中使用，它们仍然非常有用。

#### 3.1 **字符串大小写转换**

```javascript
Vue.filter('capitalize', function (value) {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
});

Vue.filter('uppercase', function (value) {
  return value.toUpperCase();
});

Vue.filter('lowercase', function (value) {
  return value.toLowerCase();
});
```

### 3.2 **数字格式化**
```javascript
Vue.filter('currency', function (value) {
  return '$' + value.toFixed(2);
});

Vue.filter('numberFormat', function (value) {
  return new Intl.NumberFormat().format(value);
});
```

### 3.3 **日期格式化**

你可以通过 `Date` 对象或者第三方库（如 `moment.js`）来实现日期格式化：

```javascript
Vue.filter('dateFormat', function (value, format = 'YYYY-MM-DD') {
  return moment(value).format(format);
});
```

在 Vue 3 中，可以直接在模板中使用方法来处理日期格式化。

```vue
<template>
  <div>{{ formatDate(date) }}</div>
</template>

<script>
import moment from 'moment';

export default {
  data() {
    return {
      date: '2023-10-01T12:00:00'
    };
  },
  methods: {
    formatDate(value) {
      return moment(value).format('YYYY-MM-DD');
    }
  }
};
</script>
```

### 3.4 **文本截断**

```javascript
Vue.filter('truncate', function (value, length) {
  if (!value) return '';
  return value.length > length ? value.substring(0, length) + '...' : value;
});
```

### 3.5 **处理数组或对象的过滤器**

比如筛选出数组中的偶数，或过滤出对象中的某些键值：

```javascript
Vue.filter('filterEven', function (array) {
  return array.filter(num => num % 2 === 0);
});
```

## 4. **Vue 3 中的替代方案**

由于 Vue 3 不再支持过滤器，你可以通过以下方法进行替代：

* 使用 **计算属性** 来代替过滤器。
* 使用 **方法** 来代替过滤器。
* 对于常用的格式化功能，可以使用第三方库（如 `moment.js`、`date-fns`）来简化日期和数字处理。

## **总结**

* **Vue 2** 支持自定义过滤器，通过 `Vue.filter()` 或局部注册方式来实现。
* **Vue 3** 移除了过滤器的功能，推荐使用计算属性和方法来代替。
* 常见的过滤器包括大小写转换、日期格式化、数字格式化等，若你使用 Vue 3，建议使用计算属性或方法来实现相同的功能。

如果你正在使用 Vue 2.x，过滤器依然是一个很有用的工具，但如果你使用 Vue 3.x，可以考虑使用其他更强大、灵活的方式（如计算属性和方法）来处理数据。
