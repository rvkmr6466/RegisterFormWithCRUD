import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from './custom-validators';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'reactiveForm';
	myForm: FormGroup;
	submitted = false;
	country = 'india';
	filterStateArray: any;
	filterCityArray: any;
	showData: any = [];
	stateArray = [
		{ country: "India", state: 'Gujrat', statecode: 'Guj' },
		{ country: "India", state: 'Delhi', statecode: 'Guj' },
		{ country: "India", state: 'Uttar Pradesh', statecode: 'Guj' },
	];

	cityArray = [
		{ state: "Gujrat", city: 'Ahmedabad', citycode: 'Guj' },
		{ state: "Gujrat", city: 'Surat', citycode: 'Guj' },
		{ state: "Gujrat", city: 'Vadodara', citycode: 'Guj' },
		{ state: "Delhi", city: 'Nirman Vihar', citycode: 'Nirman Vihar' },
		{ state: "Delhi", city: 'Laxmi Nagar', citycode: 'Laxmi Nagar' },
		{ state: "Delhi", city: 'Shahdara', citycode: 'Shahdara' },
		{ state: "Uttar Pradesh", city: 'Ghaziabad', citycode: 'Gzb' },
		{ state: "Uttar Pradesh", city: 'Noida', citycode: 'Noi' },
		{ state: "Uttar Pradesh", city: 'Varanasi', citycode: 'Vns' },
	];

	constructor(
		private fb: FormBuilder,
	) {
		this.myForm = this.fb.group({
			firstname: ['', Validators.required],
			lastname: ['', Validators.required],
			email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
			phoneNumber: ['', Validators.compose([Validators.pattern('[- +()0-9]+'), Validators.required, Validators.minLength(9), Validators.maxLength(10)])],
			address: this.fb.group({
				country: ['', Validators.required],
				state: ['', Validators.required],
				city: ['', Validators.required],
			}),
			dob: ['', Validators.required],
			password: [null,
				Validators.compose([
					Validators.required,
					CustomValidators.patternValidator(/\d/, { hasNumber: true }),
					CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
					CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
					CustomValidators.patternValidator(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}$/, { hasSpecialCharacters: true }),
					Validators.minLength(8)
				])
			],
		}, {
			validator: CustomValidators.patternValidator
		})
		this.fetchDataFromLS();
	}

	selectCountry(event: any) {
		console.log(event)
		this.filterStateArray = [...this.stateArray];
		this.filterStateArray = this.filterStateArray.filter((item: any) => {
			if (item.country == this.country) {
				return;
			}
			else {
				return -1;
			}
		});
		console.log(this.stateArray);
	}

	filterState(event: any) {
		console.log(event)
		this.filterCityArray = [...this.cityArray];
		this.filterCityArray = this.filterCityArray.filter((item: any) => {
			if (item.state == event.target.value) {
				return -1;
			}
			else {
				return;
			}
		});
		console.log(this.filterCityArray);
	}

	addressControl() {
		this.myForm.controls;
	}

	myFormData: any = [];
	onSubmit() {
		this.submitted = true;
		if (!this.myForm.valid) {
			return
		}
		else {
			if (this.showData.length > 0) {
				this.myFormData = [...this.showData]
				localStorage.removeItem('myFormData');
				this.myFormData.push(this.myForm.value)
				this.setItemInLS()
			}
			else {
				this.myFormData.push(this.myForm.value)
				this.setItemInLS()
			}
		}
		alert('A new record has been added!');
		this.fetchDataFromLS();
		this.myForm.reset();
	}

	isUpdate: boolean = false;
	toUpdateIndex: number = 0;
	edit(index: number) {
		this.isUpdate = true;
		this.toUpdateIndex = index;
		this.fetchDataFromLS();
		this.updatedfilteredStateData(index); // filterStateData
		this.updatedfilteredCityData(index); // filterCityData
		this.myForm.setValue(this.showData[index]);
		this.myForm.controls.address.patchValue(this.showData[index].address)
		//myForm.controls.address.get('city')?.errors?.required
	}

	updatedfilteredStateData(index: number) {
		this.filterStateArray = this.stateArray.filter((item: any) => {
			if (this.showData[index].address.state !== item.state) {
				return;
			}
			else {
				return -1;
			}
		})
	}

	updatedfilteredCityData(index: number) {
		this.filterCityArray = this.cityArray.filter((item: any) => {
			if (this.showData[index].address.city !== item.city) {
				return;
			}
			else {
				return -1;
			}
		})
	}

	delete(index: number) {
		let r = confirm("Confirm to delete");
		if (r == true) {
			this.fetchDataFromLS();
			this.myFormData.splice(index, 1);
			this.setItemInLS();
			this.fetchDataFromLS();
		} else {
			return;
		}
		this.fetchDataFromLS();
		this.myFormData.splice(index, 1);
		this.setItemInLS();
		this.fetchDataFromLS();
	}

	fetchDataFromLS() {
		//fetch data from localstorage
		let lsData = localStorage.getItem('myFormData');
		this.showData = lsData ? JSON.parse(lsData) : [];
		this.myFormData = [...this.showData]
	}

	setItemInLS() {
		localStorage.setItem('myFormData', JSON.stringify(this.myFormData));
	}

	update() {
		this.fetchDataFromLS();
		localStorage.removeItem('myFormData');
		this.myFormData[this.toUpdateIndex] = this.myForm.value;
		this.setItemInLS();
		this.fetchDataFromLS();
		this.myForm.reset();
	}
}
