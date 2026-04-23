---
id: error-handling
parent: root
label: Error Handling
explored: false
order: 4
---

# Gestion d'erreurs

Rust n'a pas d'exceptions. Les erreurs sont des **valeurs** (`Result<T, E>`).

## L'opérateur `?`

Propage l'erreur si `Err`, retourne la valeur si `Ok`.

```rust
use std::fs;
use std::io;

fn read_username(path: &str) -> Result<String, io::Error> {
    let content = fs::read_to_string(path)?; // ? propage l'erreur
    Ok(content.trim().to_string())
}

fn main() {
    match read_username("user.txt") {
        Ok(name) => println!("Utilisateur : {}", name),
        Err(e)   => eprintln!("Erreur : {}", e),
    }
}
```

## Erreurs personnalisées

```rust
use std::fmt;

#[derive(Debug)]
enum AppError {
    Io(std::io::Error),
    Parse(std::num::ParseIntError),
}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            AppError::Io(e)    => write!(f, "IO error: {}", e),
            AppError::Parse(e) => write!(f, "Parse error: {}", e),
        }
    }
}
```

## Liens

- [Rust Book — Error Handling](https://doc.rust-lang.org/book/ch09-00-error-handling.html)
