# Symbol原理

用来生成一个独一无二的值

Symbol是ES6规范中的一种原生数据类型,也就是说所有支持ES6规范的JavaScript都应该实现Symbol这一基本数据类型

那么对于V8而言,就应该在底层实现Symbol对象

`src/builtins/builtins-symbol.cc` 17
```c++
// ES #sec-symbol-constructor
BUILTIN(SymbolConstructor) {
  HandleScope scope(isolate);
  if (!args.new_target()->IsUndefined(isolate)) {  // [[Construct]]
    THROW_NEW_ERROR_RETURN_FAILURE(
        isolate, NewTypeError(MessageTemplate::kNotConstructor,
                              isolate->factory()->Symbol_string()));
  }
  // [[Call]]
  Handle<Symbol> result = isolate->factory()->NewSymbol();
  Handle<Object> description = args.atOrUndefined(isolate, 1);
  if (!description->IsUndefined(isolate)) {
    ASSIGN_RETURN_FAILURE_ON_EXCEPTION(isolate, description,
                                       Object::ToString(isolate, description));
    result->set_description(String::cast(*description));
  }
  return *result;
}
```

我们可以看到这个最终的函数返回结果是 result,

result = isolate -> factory() -> NewSymbol();

`src/torque/earley-parser.h` 437

```c++
 Symbol* NewSymbol(std::initializer_list<Rule> rules = {}) {
    auto symbol = std::make_unique<Symbol>(rules);
    Symbol* result = symbol.get();
    generated_symbols_.push_back(std::move(symbol));
    return result;
  }
```

可以看出Symbol 是从 make_unique 函数中创建的

参考 https://en.cppreference.com/w/cpp/memory/unique_ptr/make_unique,

```c++
namespace detail {
template<class>
constexpr bool is_unbounded_array_v = false;
template<class T>
constexpr bool is_unbounded_array_v<T[]> = true;
 
template<class>
constexpr bool is_bounded_array_v = false;
template<class T, std::size_t N>
constexpr bool is_bounded_array_v<T[N]> = true;
} // namespace detail
 
template<class T, class... Args>
std::enable_if_t<!std::is_array<T>::value, std::unique_ptr<T>>
make_unique(Args&&... args)
{
    return std::unique_ptr<T>(new T(std::forward<Args>(args)...));
}
 
template<class T>
std::enable_if_t<detail::is_unbounded_array_v<T>, std::unique_ptr<T>>
make_unique(std::size_t n)
{
    return std::unique_ptr<T>(new std::remove_extent_t<T>[n]());
}
 
template<class T, class... Args>
std::enable_if_t<detail::is_bounded_array_v<T>> make_unique(Args&&...) = delete;
```

可以看出

make_unique 是从unique_ptr中派生出来的

参考 https://en.cppreference.com/w/cpp/memory/unique_ptr

std::unique_ptr is a smart pointer that owns and manages another object through a pointer and disposes of that object when the unique_ptr goes out of scope.

也就是说unique_ptr是一个对象.


看一下Symbol在pollyfill中的实现

```js
 function Symbol(description) {
      if (!(this instanceof Symbol)) return new Symbol(description, secret);
      if (this instanceof Symbol && arguments[1] !== secret) throw TypeError();

      var descString = description === undefined ? undefined : String(description);

      set_internal(this, '[[SymbolData]]', unique(128));
      set_internal(this, '[[Description]]', descString);

      symbolMap[this] = this;
      return this;
    }

```


可以看出,就是一个构造函数, 只是这个函数在使用的时候有点特殊,return 了一个Symbol自身的实例,也就是一个对象.

# 问题一: 那么一个对象,是不能在对象中作为key来使用的

```js
    Object.defineProperty(Symbol.prototype, 'toString', {
      value: function toString() {
        var s = strict(this);
        var desc = s['[[Description]]'];
        return 'Symbol(' + (desc === undefined ? '' : desc) + s['[[SymbolData]]'] + ')';
      },
      configurable: true, writeable: true, enumerable: false });
```
在一下返回值,`'Symbol(' + (desc === undefined ? '' : desc) + s['[[SymbolData]]'] + ')';`
这个只是一个以Symbol字符串description开头的字符串, 按道理是应该没有后面的`s['[[SymbolData]]']`,为了保持唯一性就加上了这个,唯一标示.

# 问题二, Object.getPropertyNames 是不是会打印出 Symbol,答案 是 ,所以需要改写 getPropertyNames

```js
 define(
      Object, 'getOwnPropertyNames',
      function getOwnPropertyNames(o) {
        if (Object.prototype.toString.call(o) === '[object Window]') {
          // Workaround for cross-realm calling by IE itself.
          // https://github.com/inexorabletash/polyfill/issues/96
          try {
            return $getOwnPropertyNames(o).filter(isStringKey);
          } catch (_) {
            return $window_names.slice();
          }
        }
        return $getOwnPropertyNames(o).filter(isStringKey);
      }, !nativeSymbols);

    // 19.1.2.8 Object.getOwnPropertySymbols ( O )
    define(
      Object, 'getOwnPropertySymbols',
      function getOwnPropertySymbols(o) {
        return $getOwnPropertyNames(o).filter(symbolForKey).map(symbolForKey);
      }, !nativeSymbols);
```



# 问题三 JSON在序列化的时候,不能序列化Symbol,但是目前而言,它只是一个String,也就是说会被序列化.

没有办法, JSON.stringify 后 会变成 一个随机字符串


# 问题四 typeof symbol 怎么被改写

没有办法, typeof 是一个不能被改写的操作, 如此依赖 typeof symbol === 'object'


Symbol 不是能是一个构造函数,它没有 prototype,

同时 symbol实例是没有__proto__属性的,因此 instanceof 不能被修改








