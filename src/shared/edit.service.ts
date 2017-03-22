import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Jsonp } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

const CREATE_ACTION = 'push';
const UPDATE_ACTION = 'update';
const REMOVE_ACTION = 'remove';

@Injectable()
export class EditService extends BehaviorSubject<any[]> {
    user$;
    users: any = [];

    constructor(private jsonp: Jsonp, public af: AngularFire) {
        super([]);
        this.user$ = af.database.list('/user');
        this.user$.subscribe(data => {
            console.log(data);
            this.users = data;
            // console.log(this.users)
        });
    }

    private data: any[] = [];

    public read() {
        // console.log('users' + this.user$.subscribe());
        if (this.data.length) {
            return super.next(this.data);
        }
        this.fetch()
            .do(data => this.data = data)
            .subscribe(data => {
                super.next(data);
            });
        
        // this.fetch()
        //     .do(data => {
        //         let local;
        //         this.user$.subscribe(result => result = local);
        //         console.log('this data' + local);
        //         data = local;
        //     })
        //     .subscribe(data => {
        //         super.next(data);
        //     });
    }

    public save(data: any, isNew?: boolean) {
        const action = isNew ? CREATE_ACTION : UPDATE_ACTION;

        this.reset();

        this.fetch(action, data)
            .subscribe(() => this.read(), () => this.read());
    }

    public remove(data: any) {
        this.reset();

        this.fetch(REMOVE_ACTION, data)
            .subscribe(() => this.read(), () => this.read());
    }

    public resetItem(dataItem: any) {
        if (!dataItem) { return; }

        //find orignal data item
        const originalDataItem = this.users.find(item => item.$key === dataItem.$key);
console.log('test'+originalDataItem);
        //revert changes
        Object.assign(originalDataItem, dataItem);

        super.next(this.data);
    }

    private reset() {
        this.users = [];
    }

    private fetch(action: string = "", data?: any): FirebaseListObservable<any[]>  {
        console.log('mmmm'+JSON.stringify(data))
        if(action == ""){
            return this.user$.map(result => result)
        } else if (action == "update"){
            return this.user$.update(data.$key.replace('user',''), { firstname: data.firstname, lastname: data.lastname, email: data.email});
        } else if (action == "push"){
            return this.user$.push(data.$key.replace('user',''), { firstname: data.firstname, lastname: data.lastname, email: data.email});
        } else if (action == "remove"){
            return this.user$.remove(data.$key.replace('user',''));
        }
        

        // return this.jsonp
        //     .get(`http://demos.telerik.com/kendo-ui/service/Products/${action}?callback=JSONP_CALLBACK${this.serializeModels(data)}`)
        //     .map(response => response.json());

    }

    // private serializeModels(data?: any): string {
    //     return data ? `&models=${JSON.stringify([data])}` : '';
    // }
}
