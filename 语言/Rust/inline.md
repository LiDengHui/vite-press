# inline

In Rust, the #[inline] attribute is a hint to the compiler that suggests inserting the function's code directly at the call site (inline expansion) rather than performing a regular function call. This is typically used for:

Small, frequently called functions where the overhead of a function call would be significant
Generic functions that need to be instantiated for multiple types
Cases where inlining enables further optimizations
In this specific generated visitor code from SWC (Speedy Web Compiler), the #[inline] attribute is used extensively because:

These visitor methods are called recursively during AST traversal
The compiler needs to handle many different node types efficiently
The code is generated automatically and needs to be highly optimized
The compiler may still choose to ignore the hint based on its optimization heuristics, but in practice this attribute helps reduce function call overhead in the hot paths of the compiler's AST processing.

For the specific call expression visitor shown:


```rust
#[inline]
fn visit_mut_call_expr(&mut self, node: &mut CallExpr) {
<CallExpr as VisitMutWith<Self>>::visit_mut_children_with(node, self)
}
```
The inline hint helps ensure that visiting each CallExpr node in the AST doesn't incur unnecessary function call overhead, which is critical for compiler performance.
