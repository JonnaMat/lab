---
title: "Cross-Entropy Loss"
tags: ["Mathematics", "Foundations", "Loss Functions", "Machine Learning"]
kind: "deep-dive"
hook: "How wrong are my predictions compared to the ground truth? Understanding the core loss function for classification."
image: ""
imageAlt: "Cross-entropy loss visualization"
keyPoints:
  - "Cross-entropy measures the difference between predicted and true probability distributions"
  - "For classification, we convert raw logits to probabilities using softmax"
  - "The -log transformation penalizes confident wrong predictions heavily"
---

# Cross-Entropy Loss

> *How wrong are my predictions compared to the ground truth?*

Cross-entropy loss is the standard objective for classification tasks in modern machine learning, including deep learning and large language models.

In classification, models output **logits**, i.e. raw (unnormalized) scores for each class. In large language models (LLMs), next-token predictionis also interpreted as a classification problem: the vocabulary (often 100k+ tokens) defines the class space, and logits are obtained by projecting hidden states onto the vocabulary matrix.

The central question becomes: *How confident and correct is my model?*

## From Logits to Probabilities


> Raw logits are not directly interpretable: a score of 3.2 is meaningless without context. What matters is the *relative scale* of all class scores.

To make logits meaningful, we convert them into probabilities using the **softmax function**.

### Softmax

Given logits vector \( z = [z_0, z_1, ..., z_n] \), the probability of class \( j \) is:

\[
 p_j  = softmax(z_j) = \frac{e^{z_j}}{\sum_k e^{z_k}}.
\]

### Why softmax?

- Produces a valid probability distribution
- Emphasizes relative differences between logits
- Amplifies large scores while suppressing smaller ones

Properties:
- $ p_j \in (0,1) $
- \( \sum_j p_j = 1 \)



## Cross-Entropy Loss

Given the ground truth class index \( i \), the cross-entropy loss is: 


\[
 L = -log(p_i) = -log(\frac{e^{z_j}}{\sum_k e^{z_k}}). 
\]

This measures how much probability mass the model assigns to the correct class.

## Intuition

### Why the negative logarithm? 

- If the model is perfectly confident:  \( p_i = 1 \Rightarrow L = 0 \)

- If the model is completely wrong (confident): \( p_i \to 0 \Rightarrow L \to \infty \)

Thus, cross-entropy strongly penalizes **confident wrong predictions**, which is crucial for stable learning.

## Example

Let's look at a simple example. Assume we have a dataset of only 4 classes (e.g., handwritten digits).


Let: 
- Ground truth: class \( i = 3 \)
- Logits:  $ z = [0.0, 0.2, 4.0, 3.2] $

After applying softmax:

- The model assigns highest probability to class 2 (incorrect)
- Class 3 still receives some probability

→ The resulting loss will be **moderately high**, reflecting an incorrect but not catastrophic prediction.


## Relative Nature of the Loss

Although the loss depends only on \( p_i \), this probability is **relative to all other logits**.


Example (correct class = 0):

**Case 1:**  
logits = [10, 1, 2]  
\[
p_0 \approx 0.999542,\quad L \approx 0.000458
\]

→ ✅ Very low loss (high confidence)

**Case 2:**  
logits = [10, 9, 8]

\[
p_0 \approx 0.6652,\quad L \approx 0.407
\]

→ ❌ Higher loss (uncertain prediction)

Even though both predictions are **correct**,

> cross-entropy penalizes lack of confidence (small margin).

This makes it fundamentally different from accuracy.

## Practical implementation 

### Naïve Implementation

```python
def cross_entropy_loss(
    logits: np.ndarray,  # (n, d)
    targets: np.ndarray  # (n,)
) -> np.ndarray:
    """Computes per-sample cross-entropy loss."""
    exp = np.exp(logits)
    probabilities = exp / np.sum(exp, axis=1, keepdims=True)
    loss = -np.log(probabilities[np.arange(len(targets)), targets])
    return loss
```

**Numerical Stability:** Exponentials can overflow for large logits. A standard trick is to shift logits by their maximum:

\[
p_j = softmax(z_j) = \frac{e^{z_j}}{\sum_k e^{z_k}}
= \frac{e^{z_j - z_{\max}}}{\sum_k e^{z_k - z_{\max}}}
\]

This works because multiplying numerator and denominator by the same constant does not change the result. Using the identity:

\[
e^{z_j} = e^{z_j - z_{\max}} \cdot e^{z_{\max}}
\]

we factor out \( e^{z_{\max}} \), which cancels.

This transformation preserves correctness while preventing numerical overflow.

### Stable Implementation

```python
def cross_entropy_loss(
    logits: np.ndarray,  # (n, d)
    targets: np.ndarray  # (n,)
) -> np.ndarray:
    shifted = logits - np.max(logits, axis=1, keepdims=True)
    exp = np.exp(shifted)
    probabilities = exp / np.sum(exp, axis=1, keepdims=True)
    loss = -np.log(probabilities[np.arange(len(targets)), targets])
    return loss
```

## Gradient (Backpropagation)

A key reason for the popularity of cross-entropy with softmax is its clean gradient.

Let $ p_j = softmax(z_j) $ , then:

\[
p_j = \frac{e^{z_j}}{\sum_k e^{z_k}}
\]

and the loss:

\[
L = -\log(p_i)  = -\log\left(\frac{e^{z_i}}{\sum_k e^{z_k}}\right)
= -z_i + \log\left(\sum_k e^{z_k}\right)
\]

where \( i \) is the ground truth class index. 

We now compute \( \frac{\partial L}{\partial z_j} \).

**Case 1: \( j = i \) (correct class)**

\[
\frac{\partial L}{\partial z_i}
= -1 + \frac{e^{z_i}}{\sum_k e^{z_k}}
= p_i - 1
\]

**Case 2: \( j \neq i \) (other classes)**

\[
\frac{\partial L}{\partial z_j}
= \frac{e^{z_j}}{\sum_k e^{z_k}}
= p_j
\]


Thus:

\[
\frac{\partial L}{\partial z_j} =
\begin{cases}
p_j - 1 & \text{if } j = i \\
p_j     & \text{if } j \neq i
\end{cases}
\]

or, more compactly in vector form:

\[
\frac{\partial L}{\partial z} = p - y
\]

where \( y \) is the one-hot encoded ground truth vector.


We used the following identities:

- Logarithm product rule:
  \[
  \log(ab) = \log(a) + \log(b)
  \]

- Derivative of the logarithm:
  \[
  \frac{d}{dx} \log(x) = \frac{1}{x}
  \quad \text{(and by chain rule: } \frac{d}{dx} \log(f(x)) = \frac{f'(x)}{f(x)}\text{)}
  \]

- Derivative of the exponential:
  \[
  \frac{d}{dx} e^x = e^x
  \]

### Insight

- The gradient is simply prediction minus target
- This leads to efficient and numerically stable training
- No explicit logarithms or exponentials appear in the final gradient

# Key Takeaways

- Cross-entropy measures confidence in the correct class
- Softmax makes predictions comparable across classes
- The loss is relative, not absolute
- Numerical stability is essential in practice
- The gradient simplifies to a remarkably elegant form
