# IOC 控制反转()

控制反转 (inversion of control, 缩写 IOC), 是一种设计原则, 顾名思义,他是用于面向对象设计中的各种控件.

可以降低代码的耦合度, 使程序模块化,易于扩展, IOC意味着将依赖模块和被依赖模块都交给容器去管理,当我们使用模块的时候,由容器动态的将它的依赖关系注入到模块中,

正对上面的问题, 往往需要IOC模式, 一般使用DI(Dependency Injection) 依赖注入的方式实现.


以订单为例子, 先看美誉依赖注入的情况.

```js
// 订单model类, models/order.js
class Order {
    constructor() {}

    insert() {
        return true;
    }
}

// 订单类 controllers/OrderController.js
const Order = require("./Order.js");

class OrderController {
    constructor() {
        this.order = new Order();
    }

    createOrder(...args) {
        this.order.insert(...args);
    }
}

// router/index.js
const OrderController = require("./OrderController.js");
const orderController = new OrderController();
```

上面是没有依赖注入的情况, OrderController 类耦合了Order类, 在使用前必须require 引入 Order类才能使用,假如Order类发生了修改变化, 那么所有依赖这个Order类的文件都需要修改,

来在看看依赖注入的情况:

```js
// 订单model类, models/order.js
class Order {
    constructor() {}

    insert() {
        return true;
    }
}

// 订单类 controllers/OrderController.js
const Order = require("./Order.js");

class OrderController {
    constructor(order) {
        this.order = order;
    }

    createOrder(...args) {
        this.order.insert(...args);
    }
}

// router/index.js
const Order = require("../model/Order.js");
const OrderController = require("./OrderController.js");
const orderController = new OrderController(new Order());
```

可以看出依赖注入已经对模块进行了解耦,但是还是有不足之处, 下面总结一下依赖注入的优缺点:

优点: 通过依赖注入高层模块与底层模块耦合度降低,因此底层模块发生变化时,我们不需要了解底层模块发生的变化, 只需要管理router中依赖的路径.

不足: 

    我们所有依赖的模块都在router中引入,明显增加了router模块的复杂性, 我们需要一个专门管理注入及被注入的容器. 即我们常说的IOC 容器.

```js
class IOC {
    constructor() {
        this.controller = new Map();
    }

    bind(key, callback) {
        this.controller.set(key, { callback, single: false });
    }

    sigleton(key, callback) {
        this.controller.set(key, { callback, single: true });
    }

    use(key) {
        const item = this.controller.get(key);
        if (!item) {
            throw new Error("error");
        }

        if (item.single && !item.instance) {
            item.instance = item.callback();
        }

        return item.single ? item.instance : item.callback();
    }
}
// router/index.js
const Order = require("../model/Order.js");
const OrderController = require("./OrderController.js");

ioc.bind("order", (...args) => new Order(...args));
ioc.bind("orderController", (...args) => new OrderController(ioc.use("order")));

// router.js
const ioc = require("../ioc.js");
const orderController = ioc.use("orderController");
```

上面就是一个简单的ICO 容器实现, 通过bind方法将模块间的依赖绑定到容器中,通过use方法判断模块是否存在,
若不存在则报错;
存在则判断是否实例化,已实例化不需要执行的callback().