class UI {
  constructor() {
    this.budgetFeedback = document.querySelector(".budget-feedback");
    this.expenseFeedback = document.querySelector(".expense-feedback");
    this.savingsFeedback = document.querySelector(".savings-feedback");
    this.budgetForm = document.getElementById("budget-form");
    this.budgetInput = document.getElementById("budget-input");
    this.budgetAmount = document.getElementById("budget-amount");
    this.savingsForm = document.getElementById("savings-form");
    this.savingsInput = document.getElementById("savings-input");
    this.savingsAmount = document.getElementById("savings-amount");
    this.expenseAmount = document.getElementById("expense-amount");
    this.balance = document.getElementById("balance");
    this.balanceAmount = document.getElementById("balance-amount");
    this.expenseForm = document.getElementById("expense-form");
    this.expenseInput = document.getElementById("expense-input");
    this.amountInput = document.getElementById("amount-input");
    this.expenseList = document.getElementById("expense-list");
    this.itemList = [];
    this.itemID = 0;
  }
  //submit budget method
  submitBudgetForm(){
    const value = this.budgetInput.value;
    if(value===''|| value < 0){
      this.budgetFeedback.classList.add('showItem');
      this.budgetFeedback.innerHTML =`<p>value cannot be empty or negative </p>`;
      const self = this;
      setTimeout(function(){
        self.budgetFeedback.classList.remove('showItem');
      },4000)
    }else{
      this.budgetAmount.textContent = value;
      this.budgetInput.value='';
      this.showBalance();
    }
  }
  //submit saving method
  submitSavingsForm(){
    const value = this.savingsInput.value;
    const amountValue = this.budgetAmount.textContent
    
    if(value==='' || value <0){
      this.savingsFeedback.classList.add('showItem');
      this.savingsFeedback.innerHTML=`<p>value cannot be empty or negative. </p>`;
      const self = this;
      setTimeout(function(){
        self.budgetFeedback.classList.remove('showItem');
      },4000)
    }else{
      this.computeSavings();
      this.showBalance();
    }
    
  }


  //show balance
  showBalance(){
    const expense = this.totalExpense();
    const savings = this.savingsAmount.textContent;
    const total = parseInt(this.budgetAmount.textContent) - savings;
    this.balanceAmount.textContent = total - expense;
    if(total<0){
      this.balance.classList.remove('showGreen','showBlack');
      this.balance.classList.add('showRed');
    }else if(total>0){
      this.balance.classList.remove('showRed','showBlack');
      this.balance.classList.add('showGreen');
    }else if(total==0){
      this.balance.classList.remove('showRed','showGreen');
      this.balance.classList.add('showBlack');
    }
  }
  //submit expense form
  submitExpenseForm(){
    const expenseValue = this.expenseInput.value;
    const amountValue = this.amountInput.value;
    if(expenseValue === '' || amountValue === '' || amountValue < 0){
      this.expenseFeedback.classList.add('showItem');
      this.expenseFeedback.innerHTML = `<p>value cannot be empty or negative </p>`;
      const self = this;
      setTimeout(function(){
        self.expenseFeedback.classList.remove('showItem');
      },4000)
    }else{
      let amount = parseInt(amountValue);
      this.expenseInput.value ='';
      this.amountInput.value ='';

      let expense = {
        id:this.itemID,
        title:expenseValue,
        amount:amount,
      }

      this.itemID++;
      this.itemList.push(expense);
      this.addExpense(expense);
      this.showBalance();
    }
  }
  //add expense
  addExpense(expense){
    const div = document.createElement('div');
    div.classList.add('expense');
    div.innerHTML =`
            <div class="expense-item d-flex justify-content-between align-items-baseline">

            <h6 class="expense-title mb-0 text-uppercase list-item">- ${expense.title}</h6>
            <h5 class="expense-amount mb-0 list-item">${expense.amount}</h5>

            <div class="expense-icons list-item">

            <a href="#" class="edit-icon mx-2" data-id="${expense.id}">
              <i class="fas fa-edit"></i>
            </a>
            <a href="#" class="delete-icon" data-id="${expense.id}">
              <i class="fas fa-trash"></i>
            </a>
            </div>
          </div>
    `;

    this.expenseList.appendChild(div);
  }
  //savings
  computeSavings(){
    let savings = 0;
    const budget = this.budgetAmount.textContent;
    const savingsPercent = this.savingsInput.value;
    if(savingsPercent !== 0 || budget !== 0 ){
      savings = (budget/100) * savingsPercent;
      
    }
    this.savingsInput.value='';
    this.savingsAmount.textContent = savings;
    return savings;
  }


  //total expense
  totalExpense(){
    let total = 0;
    if(this.itemList.length>0){
      total = this.itemList.reduce(function(acc,curr){
        acc += curr.amount;
        return acc;
      },0)
    }
    this.expenseAmount.textContent = total;
    return total;
  }
  //edit expense
  editExpense(element){
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement.parentElement.parentElement;
    //remove from dom
    this.expenseList.removeChild(parent);
    //remove from the dom
    let expense = this.itemList.filter(function(item){
      return item.id === id;
    });
    //show value
    this.expenseInput.value = expense[0].title;
    this.amountInput.value= expense[0].amount;
    //remove the list
    let tempList = this.itemList.filter(function(item){
      return item.id !== id;
    });
    this.itemList = tempList;
    this.showBalance();
  }

  //delete expense
  deleteExpense(element){
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement.parentElement.parentElement;
    //remove from dom
    this.expenseList.removeChild(parent);
    //remove the list
    let tempList = this.itemList.filter(function(item){
      return item.id !== id;
    });
    this.itemList = tempList;
    this.showBalance();
  }

}

function eventListenters(){
    const budgetForm = document.getElementById('budget-form');
    const savingsForm = document.getElementById('savings-form');
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');

  // instance of UI class

  const ui = new UI()


  //budget form submit
  budgetForm.addEventListener('submit', function(event){
    event.preventDefault();
    ui.submitBudgetForm();
  })

  //savings form submit
  savingsForm.addEventListener('submit', function(event){
    event.preventDefault();
    ui.submitSavingsForm();
  })


  //expense form submit
  expenseForm.addEventListener('submit', function(event){
    event.preventDefault();
    ui.submitExpenseForm();
  })

  //expense click
  expenseList.addEventListener('click', function(event){
    if(event.target.parentElement.classList.contains('edit-icon')){
      ui.editExpense(event.target.parentElement)
    }else if(event.target.parentElement.classList.contains('delete-icon')){
      ui.deleteExpense(event.target.parentElement)
    }
    
  })
}

document.addEventListener("DOMContentLoaded", function(){
  eventListenters();
})

// function numberWithCommas(x) {
//   return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// }