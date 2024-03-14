/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const processPayment = /* GraphQL */ `
  mutation ProcessPayment($input: ProcessOrderInput!) {
    processPayment(input: $input)
  }
`;
export const processOrder = /* GraphQL */ `
  mutation ProcessOrder($input: ProcessOrderInput!) {
    processOrder(input: $input)
  }
`;
export const createBook = /* GraphQL */ `
  mutation CreateBook(
    $input: CreateBookInput!
    $condition: ModelBookConditionInput
  ) {
    createBook(input: $input, condition: $condition) {
      id
      title
      description
      image
      author
      featured
      price
      orders {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateBook = /* GraphQL */ `
  mutation UpdateBook(
    $input: UpdateBookInput!
    $condition: ModelBookConditionInput
  ) {
    updateBook(input: $input, condition: $condition) {
      id
      title
      description
      image
      author
      featured
      price
      orders {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteBook = /* GraphQL */ `
  mutation DeleteBook(
    $input: DeleteBookInput!
    $condition: ModelBookConditionInput
  ) {
    deleteBook(input: $input, condition: $condition) {
      id
      title
      description
      image
      author
      featured
      price
      orders {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createBookOrder = /* GraphQL */ `
  mutation CreateBookOrder(
    $input: CreateBookOrderInput!
    $condition: ModelBookOrderConditionInput
  ) {
    createBookOrder(input: $input, condition: $condition) {
      id
      book_id
      order_id
      order {
        id
        user
        date
        total
        createdAt
        updatedAt
        customer
        __typename
      }
      createdAt
      updatedAt
      book {
        id
        title
        description
        image
        author
        featured
        price
        createdAt
        updatedAt
        __typename
      }
      customer
      __typename
    }
  }
`;
export const updateBookOrder = /* GraphQL */ `
  mutation UpdateBookOrder(
    $input: UpdateBookOrderInput!
    $condition: ModelBookOrderConditionInput
  ) {
    updateBookOrder(input: $input, condition: $condition) {
      id
      book_id
      order_id
      order {
        id
        user
        date
        total
        createdAt
        updatedAt
        customer
        __typename
      }
      createdAt
      updatedAt
      book {
        id
        title
        description
        image
        author
        featured
        price
        createdAt
        updatedAt
        __typename
      }
      customer
      __typename
    }
  }
`;
export const deleteBookOrder = /* GraphQL */ `
  mutation DeleteBookOrder(
    $input: DeleteBookOrderInput!
    $condition: ModelBookOrderConditionInput
  ) {
    deleteBookOrder(input: $input, condition: $condition) {
      id
      book_id
      order_id
      order {
        id
        user
        date
        total
        createdAt
        updatedAt
        customer
        __typename
      }
      createdAt
      updatedAt
      book {
        id
        title
        description
        image
        author
        featured
        price
        createdAt
        updatedAt
        __typename
      }
      customer
      __typename
    }
  }
`;
export const createOrder = /* GraphQL */ `
  mutation CreateOrder(
    $input: CreateOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    createOrder(input: $input, condition: $condition) {
      id
      user
      date
      total
      books {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      customer
      __typename
    }
  }
`;
export const updateOrder = /* GraphQL */ `
  mutation UpdateOrder(
    $input: UpdateOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    updateOrder(input: $input, condition: $condition) {
      id
      user
      date
      total
      books {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      customer
      __typename
    }
  }
`;
export const deleteOrder = /* GraphQL */ `
  mutation DeleteOrder(
    $input: DeleteOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    deleteOrder(input: $input, condition: $condition) {
      id
      user
      date
      total
      books {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      customer
      __typename
    }
  }
`;
export const createCart = /* GraphQL */ `
  mutation CreateCart(
    $input: CreateCartInput!
    $condition: ModelCartConditionInput
  ) {
    createCart(input: $input, condition: $condition) {
      id
      user
      items {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      customer
      __typename
    }
  }
`;
export const updateCart = /* GraphQL */ `
  mutation UpdateCart(
    $input: UpdateCartInput!
    $condition: ModelCartConditionInput
  ) {
    updateCart(input: $input, condition: $condition) {
      id
      user
      items {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      customer
      __typename
    }
  }
`;
export const deleteCart = /* GraphQL */ `
  mutation DeleteCart(
    $input: DeleteCartInput!
    $condition: ModelCartConditionInput
  ) {
    deleteCart(input: $input, condition: $condition) {
      id
      user
      items {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      customer
      __typename
    }
  }
`;
export const createCartItem = /* GraphQL */ `
  mutation CreateCartItem(
    $input: CreateCartItemInput!
    $condition: ModelCartItemConditionInput
  ) {
    createCartItem(input: $input, condition: $condition) {
      id
      cart {
        id
        user
        createdAt
        updatedAt
        customer
        __typename
      }
      cartID
      bookID
      quantity
      createdAt
      updatedAt
      book {
        id
        title
        description
        image
        author
        featured
        price
        createdAt
        updatedAt
        __typename
      }
      __typename
    }
  }
`;
export const updateCartItem = /* GraphQL */ `
  mutation UpdateCartItem(
    $input: UpdateCartItemInput!
    $condition: ModelCartItemConditionInput
  ) {
    updateCartItem(input: $input, condition: $condition) {
      id
      cart {
        id
        user
        createdAt
        updatedAt
        customer
        __typename
      }
      cartID
      bookID
      quantity
      createdAt
      updatedAt
      book {
        id
        title
        description
        image
        author
        featured
        price
        createdAt
        updatedAt
        __typename
      }
      __typename
    }
  }
`;
export const deleteCartItem = /* GraphQL */ `
  mutation DeleteCartItem(
    $input: DeleteCartItemInput!
    $condition: ModelCartItemConditionInput
  ) {
    deleteCartItem(input: $input, condition: $condition) {
      id
      cart {
        id
        user
        createdAt
        updatedAt
        customer
        __typename
      }
      cartID
      bookID
      quantity
      createdAt
      updatedAt
      book {
        id
        title
        description
        image
        author
        featured
        price
        createdAt
        updatedAt
        __typename
      }
      __typename
    }
  }
`;