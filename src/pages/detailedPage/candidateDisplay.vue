<template>
<div>
    <div class="title heading">
        <h3>All Candidates</h3>
        <button><i class="bx bx-plus-medical" @click="showAddModal"></i></button>
    </div>

    <candidateModal :editableCandidate="editableCandidate" :onCandidateCreated="onCandidateCreated" :onCandidateUpdated="onCandidateUpdated" :closeModal="closeModal" v-if="showModal" />

    <candidateTable v-if="candidatedata.length > 0" :candidates="candidatedata" :onManageCandidate="manageCandidate" :ondelete="deleteCandidate" />

    <!--Using components for displaying notification -->
    <notify :nodata="nodata" :isLoading="isLoading" :isLoadingError="isLoadingError">
        <template v-slot:nodata>
            No candidate at this moment
        </template>

    </notify>
</div>
</template>

<script>
import swal from '../../common/alert';
import {
    listAllCandidates,
    deleteCandidateByID
} from "../../services/apiService";

import candidateTable from "../../components/candidateTable";
import candidateModal from "../../components/candidateModal";
import notify from '../../components/notification';
export default {
    components: {
        candidateTable,
        candidateModal,
        notify
    },
    data() {
        return {
            showModal: false,
            name: "",
            candidatedata: [],
            editableCandidate: null,
            isLoading: false,
            isLoadingError: false,
            nodata: false,
        };
    },

    mounted() {
        this.getData();
    },

    methods: {
        getData() {
            this.isLoading = true;
            // this.nodata = this.candidate.length <= 0 && !this.isLoading;
            listAllCandidates()
                .then((response) => {
                    if (response?.data.data) {
                        this.candidatedata = response.data.data;
                    }
                })
                .catch(() => {
                    this.isLoadingError = true;
                })
                .then(() => {
                    this.isLoading = false;
                    this.nodata = this.candidatedata.length <= 0 && !this.isLoading && !this.isLoadingError;
                });
        },
        showAddModal() {
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
            this.editableCandidate = null;
        },
        onCandidateCreated() {
            // this.candidatedata = [...this.candidatedata, candidate];
            this.getData();
            this.closeModal();
            swal.success();

        },

        onCandidateUpdated(candidate) {
            this.candidatedata = this.candidatedata.map(x_candidate => {
                if (x_candidate.id === candidate.id) {
                    return candidate;
                }
                return x_candidate;
            });
            this.closeModal();
            swal.success();
        },
        manageCandidate(candidate) {
            this.editableCandidate = candidate;
            this.showAddModal();
        },

        deleteCandidate(id) {
            swal.confirm("Are you sure?", (confirmed) => {
                if (confirmed) {
                    //delete request
                    deleteCandidateByID(id)
                        .then(() => {
                            this.getData();
                            swal.success();
                        })
                        .catch((err) => {
                            console.log(err);
                            swal.error("Unable to delete candidate, this might be a connection problem. Try again after some time");
                        })

                }
            })
        }

    },
};
</script>

<style scoped>
.heading>button {
    margin-right: 25px;
    outline: none;
    border: none;
}

button {
    height: 25px;
    background: #27ae60;
    color: #ffffff;
}
</style>
