import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
// import { products } from '../shared/products';
import { EditService } from '../shared/edit.service';
import { GridModule } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  user$: FirebaseListObservable<any>;
  createForm: any;
  users: any;
  idToUpdate: string;

  constructor(public fb: FormBuilder, public af: AngularFire, private editService: EditService) {
    this.editService = editService;
    let emailRegex = "^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([A-Za-z]{2,6}(?:\\.[A-Za-z]{2,6})?)$";
    this.createForm = fb.group({
      'firstname': ['', [Validators.required]],
      'lastname': ['', [Validators.required]],
      'email': ['', [Validators.required, Validators.pattern(emailRegex)]]
    })
    this.user$ = af.database.list('user');
    this.user$.subscribe(data => {
      this.users = data;
      // console.log(this.users)
    });
    
  }

  create(){
    console.log(this.createForm.value);
    this.user$.push({
      firstname: this.createForm.value.firstname,
      lastname: this.createForm.value.lastname,
      email: this.createForm.value.email
    });
    
  }

  edit(id){
    this.user$.update(this.idToUpdate, {
      firstname: this.createForm.value.firstname,
      lastname: this.createForm.value.lastname,
      email: this.createForm.value.email
    });
  }

  updateId(id){
    this.idToUpdate = id
  }

  delete(id){
    this.user$.remove(id);
    console.log(id);
  }



  //kendo
  public view: Observable<GridDataResult>;
    public gridState: State = {
        sort: [],
        skip: 0,
        take: 10
    };
    public formGroup: FormGroup;

    // private editService: EditService;
    private editedRowIndex: number;

    public ngOnInit(): void {
        this.view = this.editService.map(data => process(data, this.gridState));

        this.editService.read();
    }

    public onStateChange(state: State) {
        this.gridState = state;

        this.editService.read();
    }

    protected addHandler({sender}) {
        this.closeEditor(sender);

        this.formGroup = new FormGroup({
            'firstname': new FormControl(),
            'lastname': new FormControl("", Validators.required),
            'email': new FormControl(0)
        });

        sender.addRow(this.formGroup);
    }

    protected editHandler({sender, rowIndex, dataItem}) {
        this.closeEditor(sender);
        console.log(sender);
        console.log('dataitem'+JSON.stringify(dataItem));
        console.log('dataitemID'+JSON.stringify(dataItem.$key.replace('user', '')));

        this.formGroup = new FormGroup({
            'objectId': new FormControl(dataItem.$key),
            'firstname': new FormControl(dataItem.firstname),
            'lastname': new FormControl(dataItem.lastname, Validators.required),
            'email': new FormControl(dataItem.email)
        });

        this.editedRowIndex = rowIndex;

        sender.editRow(rowIndex, this.formGroup);
    }

    protected cancelHandler({sender, rowIndex}) {
        this.closeEditor(sender, rowIndex);
    }

    private closeEditor(grid, rowIndex = this.editedRowIndex) {
        grid.closeRow(rowIndex);
        this.editedRowIndex = undefined;
        this.formGroup = undefined;
    }

    protected saveHandler({sender, rowIndex, formGroup, isNew}) {
        const users: any = formGroup.value;

        this.editService.save(users, isNew);

        sender.closeRow(rowIndex);
    }

    protected removeHandler({dataItem}) {
        this.editService.remove(dataItem);
    }


}
