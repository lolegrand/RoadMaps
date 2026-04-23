---
id: concurrence
parent: root
label: Concurrence
explored: false
order: 5
---

# Fearless Concurrency

Le compilateur Rust **garantit à compile-time** l'absence de data races.

## Threads

```rust
use std::thread;
use std::time::Duration;

fn main() {
    let handle = thread::spawn(|| {
        for i in 1..=5 {
            println!("thread : {}", i);
            thread::sleep(Duration::from_millis(10));
        }
    });

    for i in 1..=3 {
        println!("main : {}", i);
    }

    handle.join().unwrap();
}
```

## Channels (message passing)

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        for msg in ["ping", "pong", "done"] {
            tx.send(msg).unwrap();
        }
    });

    for received in rx {
        println!("Reçu : {}", received);
    }
}
```

## Shared State avec Mutex

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let c = Arc::clone(&counter);
        handles.push(thread::spawn(move || {
            *c.lock().unwrap() += 1;
        }));
    }

    for h in handles { h.join().unwrap(); }
    println!("Compteur : {}", *counter.lock().unwrap()); // 10
}
```

## Liens

- [Rust Book — Concurrency](https://doc.rust-lang.org/book/ch16-00-concurrency.html)
