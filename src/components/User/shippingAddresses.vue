<template>
    <div class="profile-container">
      <h2>收货地址</h2>
      
      <!-- 地址列表 -->
      <el-table 
        :data="addressList" 
        stripe 
        empty-text = "暂无收货地址"
        style="margin-top: 15px;">
        
        <el-table-column prop="state" label="省" width="70"/>
        <el-table-column prop="city" label="市" width="70"/>
        <el-table-column prop="address" label="街道地址" width="320"/>
        
        <el-table-column prop="phoneNumber" label="联系电话" width="110"/>
        <el-table-column prop="contact" label="收件人" width="80" />
        <el-table-column label="默认地址" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.isDefault" type="success">默认</el-tag>
            <el-button v-else  size="small" @click="setDefaultAddress(row)">设为默认</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }" style="margin: 0 auto;">
            <el-button type="primary" size="small" @click="editAddress(row)">修改</el-button>
            <el-button type="danger" size="small" @click="deleteAddress(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 地址管理弹窗 -->
      <el-dialog v-model="addressDialogVisible" :title="isEditingAddress ? '编辑地址' : '新增地址'" width="500px">
        <el-form ref="addressFormRef" :model="addressForm" label-position="top" :rules="addressRules">
            <el-form-item label="省份" prop="state">
                <el-input v-model="addressForm.state" />
            </el-form-item>
            <el-form-item label="城市" prop="city">
                <el-input v-model="addressForm.city" />
            </el-form-item>
            <el-form-item label="街道地址" prop="address">
                <el-input v-model="addressForm.address" />
            </el-form-item>
            <el-form-item label="收件人" prop="contact">
                <el-input v-model="addressForm.contact" />
            </el-form-item>
            <el-form-item label="联系电话" prop="phoneNumber">
                <el-input v-model="addressForm.phoneNumber" />
            </el-form-item>
            <el-form-item v-if="addressList.length > 1" label="设为默认地址">
              <el-switch 
                v-model="addressForm.isDefault"
                :active-value="1" 
                :inactive-value="0"
              />
            </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="addressDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveAddress">保存</el-button>
        </template>
      </el-dialog>
      <el-button type="primary" style="margin-top: 20px;" @click="openAddressDialog">新增收货地址</el-button>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive } from "vue";
  import { ElMessage } from "element-plus";
  import {getAddressList,addAddress,setDefault,deleteUserAddress,updateAddress} from "@/api/user/shipAddress";

  const addressList = ref([ ]);
  
  // 地址表单
  const addressDialogVisible = ref(false);
  const isEditingAddress = ref(false);
  const addressFormRef = ref(null);

  const addressForm = reactive({
    addressId:null,
    address: "",
    city: "",
    state: "",
    contact:"",
    phoneNumber: "",
    isDefault: false
  });
  
  onMounted(async () => {
    loadUserInfo()
  })

  const loadUserInfo = async () => {
    getAddressList().then(res => {
      addressList.value = res.data;
    })
  }

  // 表单验证规则
  const addressRules = {
    address: [{ required: true, message: "请输入详细地址", trigger: "blur" }],
    contact: [{ required: true, message: "请输入收件人姓名", trigger: "blur" }],
    state:[{ required: true, message: "请输入省份", trigger: "blur" }],
    city: [{ required: true, message: "请输入城市", trigger: "blur" }],
    phoneNumber: [{ required: true, message: "请输入联系电话", trigger: "blur" }]
  };
  


  // 打开新增地址弹窗
  const openAddressDialog = () => {
    isEditingAddress.value = false;
    Object.assign(addressForm, { addressId: null, address:"", city: "", state: "", phoneNumber: "", isDefault: 0 });
    addressDialogVisible.value = true;
  };
  
  // 编辑地址
  const editAddress = (row) => {
    isEditingAddress.value = true;
    Object.assign(addressForm, row);
    addressDialogVisible.value = true;
  };
  
  // 删除地址
  const deleteAddress = (row) => {
    deleteUserAddress(row.addressId).then(() => {
      ElMessage.success("地址删除成功");
      loadUserInfo()
  })
    
  };
  
  // 设为默认地址
  const setDefaultAddress = (row) => {
    setDefault(row.addressId).then(() => {
      ElMessage.success("默认地址设置成功");
      loadUserInfo()
    })
  };
  
  // 保存地址（新增或编辑）
  const saveAddress = () => {

    addressFormRef.value.validate(valid => {
      if (!valid) return;
  
      if (isEditingAddress.value) {
        updateAddress(addressForm).then(() => {
          ElMessage.success("地址更新成功");
          loadUserInfo()
        })
      } else {
        addAddress(addressForm).then(() => {
          ElMessage.success("地址保存成功");
          loadUserInfo()
        })
      }
      // 处理默认地址
      if (addressForm.isDefault) {
        setDefaultAddress(addressForm);
      }
      addressDialogVisible.value = false;
    });
  };
  </script>
  
  <style scoped>
  .address-container {
    max-width: 900px;
    width: 80%;
    margin: 20px auto;
    padding: 20px;
    background: #181818;
    color: white;
    border-radius: 8px;
  }
  </style>
  