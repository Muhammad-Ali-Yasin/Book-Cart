import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  bookList: any = [
    { Name: 'Book A', Dollar: 8, Count: 0, isCart: false },
    { Name: 'Book B', Dollar: 8, Count: 0, isCart: false },
    { Name: 'Book C', Dollar: 8, Count: 0, isCart: false },
    { Name: 'Book D', Dollar: 8, Count: 0, isCart: false },
    { Name: 'Book E', Dollar: 8, Count: 0, isCart: false },
  ];

  discountData: any = [
    { diff_books: 1, percentage: 0 },
    { diff_books: 2, percentage: 5 },
    { diff_books: 3, percentage: 10 },
    { diff_books: 4, percentage: 20 },
    { diff_books: 5, percentage: 25 }
  ];

  cartList: any = [];

  totalAmountWithHighDicount:any;
  constructor() {
  }

  ngOnInit(): void {

  }

  PlusOrMinus(type: String, i: any) {
    if (type == '+') {
      this.bookList[i].Count++
    }
    else if (type == '-') {
      if (this.bookList[i].Count > 0)
        this.bookList[i].Count--
    }
  }

  AddToCart(i: any) {
    this.bookList[i].isCart = true;
    this.cartList.push(this.bookList[i]);
  }

  RemoveFromCart(i: any) {
    const index = this.cartList.findIndex((e: any) => e.Name == this.bookList[i].Name);
    if (index != -1) {
      this.bookList[i].isCart = false;
      this.bookList[i].Count = 0;
      this.cartList.splice(index, 1)
    }
  }

  Calculate() {
    let tempCartList = JSON.parse(JSON.stringify(this.cartList))
    let totalBookCount = tempCartList.reduce((acc: any, obj: any) => acc + obj.Count, 0);
    let totalDiffBookscount = tempCartList.length;

    let possibleSplitData: any = [];
    let possibleDiscountAmounts: any = [];
    if(totalBookCount){
      for (let i = totalDiffBookscount; i > 0; i--) {
        if (i <= totalBookCount) {
          let possible = [];
          let tempTotalBookCount = totalBookCount;
          let tempCartCountData = JSON.parse(JSON.stringify(tempCartList));
          for (let j = i; j > 0;) {
            let filterArr: any = tempCartCountData.filter((e: any) => e.Count != 0).sort((a:any,b:any)=> b.Count - a.Count);
            if (filterArr.length >= j) {
              let sliceArr = filterArr.slice(0, j)
              sliceArr.map((e: any) => {
                return e.Count = e.Count != 0 ? e.Count - 1 : 0;
              });
              possible.push(sliceArr);
              tempTotalBookCount = tempTotalBookCount - j;
            }
            else {
              j--
            }
          }
          possibleSplitData.push(possible)
        }
      }
  
      if (possibleSplitData?.length) {
        for (let i = 0; i < possibleSplitData.length; i++) {
          let TotalAmountWithDiscount = 0;
          let arr: any = []
          for (let j = 0; j < possibleSplitData[i].length; j++) {
            let AmountWithDiscount = 0;
            let sum = possibleSplitData[i][j].reduce((acc: any, obj: any) => acc + obj.Dollar, 0);
            let findDis:any;
            if (sum) {
              findDis = this.discountData.find((e: any) => e.diff_books == possibleSplitData[i][j].length);
              AmountWithDiscount = sum - (sum * findDis.percentage / 100);
              TotalAmountWithDiscount += AmountWithDiscount
            }
            let PossibleSplitDiscountObj = { DiffBooks : possibleSplitData[i][j].length, Amount: sum, AmountWithDiscount: AmountWithDiscount, Discount : findDis.percentage }
            arr.push(PossibleSplitDiscountObj)
          }
          let obj = { TotalAmountWithDiscount: TotalAmountWithDiscount, PossibleSplitDiscount: arr }
          possibleDiscountAmounts.push(obj)
        }
      }
  
      if (possibleDiscountAmounts?.length) {
        let minDiscountAmount = possibleDiscountAmounts.sort((a: any, b: any) => a.TotalAmountWithDiscount - b.TotalAmountWithDiscount) 
        this.totalAmountWithHighDicount = minDiscountAmount[0];
      }
    }
    else{
      this.totalAmountWithHighDicount = undefined
    }

  }
}

