+++
title = "Math Symbol Support Test"
date = "2023-01-06"
+++

# Inline Math

-   $(a+b)^2$ = $a^2 + 2ab + b^2$
-   A polynomial P of degree d over $\mathbb{F}_p$ is an expression of the form
    $P(s) = a_0 + a_1 . s + a_2 . s^2 + ... + a_d . s^d$ for some
    $a_0,..,a_d \in \mathbb{F}_p$

# Displayed Math

$$
p := (\sum_{k∈I}{c_k.v_k} + \delta_v.t(x))·(\sum_{k∈I}{c_k.w_k} + \delta_w.t(x)) − (\sum_{k∈I}{c_k.y_k} + \delta_y.t(x))
$$

Proof tree:

$$
\begin{prooftree}
\AxiomC{$f : A \rightarrow B$}
\AxiomC{$g : \neg B = B \rightarrow \bot$}
\AxiomC{$x : A$}
\UnaryInfC{$f(x) : B$}
\UnaryInfC{$g(f(x)) : \bot$}
\UnaryInfC{$h : A \rightarrow \bot$}
\BinaryInfC{$h \in \neg A$}
\BinaryInfC{$f \rightarrow g \rightarrow \neg A$}
\end{prooftree}
$$
